"use client";

import { useEffect, useMemo, useState } from "react";
import { DailyTotals } from "@/components/DailyTotals";
import { MealReview } from "@/components/MealReview";
import type { MacroTotals, MealReview as MealReviewType } from "@/domain/meal/types";
import { getOrCreateBrowserTesterId } from "@/lib/testerIdentity";

const emptyTotals: MacroTotals = {
  calories: 0,
  proteinGrams: 0,
  carbsGrams: 0,
  fatGrams: 0
};

export function ChatMealLogger() {
  const [testerId, setTesterId] = useState("");
  const [message, setMessage] = useState("I ate 2 rotis, black chana sabzi and 200g cooked rice.");
  const [review, setReview] = useState<MealReviewType | null>(null);
  const [totals, setTotals] = useState(emptyTotals);
  const [mealCount, setMealCount] = useState(0);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [lastConfirmed, setLastConfirmed] = useState("");

  useEffect(() => {
    const id = getOrCreateBrowserTesterId();
    setTesterId(id);
  }, []);

  useEffect(() => {
    if (testerId) {
      void loadTotals(testerId);
    }
  }, [testerId]);

  const canSubmit = useMemo(
    () => testerId.length > 0 && message.trim().length > 0 && !isInterpreting,
    [testerId, message, isInterpreting]
  );

  async function interpretMeal() {
    if (!canSubmit) {
      return;
    }

    setError("");
    setLastConfirmed("");
    setIsInterpreting(true);
    const start = new Date().toISOString();
    setStartedAt(start);

    try {
      const response = await fetch("/api/meal/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testerId, message })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Interpretation failed");
      }

      setReview(payload.review);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not interpret the meal.");
    } finally {
      setIsInterpreting(false);
    }
  }

  async function confirmMeal() {
    if (!review) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/meal/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testerId, startedAt, review })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Save failed");
      }

      setLastConfirmed("Meal confirmed and saved.");
      setReview(null);
      setMessage("");
      await loadTotals(testerId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the meal.");
    } finally {
      setIsSaving(false);
    }
  }

  async function loadTotals(id: string) {
    const response = await fetch(`/api/totals/today?testerId=${encodeURIComponent(id)}`);
    const payload = await response.json();

    if (response.ok) {
      setTotals(payload.totals);
      setMealCount(payload.mealCount);
    }
  }

  async function recordCorrection(field: string, itemName: string) {
    if (!testerId) {
      return;
    }

    await fetch("/api/events/correction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testerId, field, itemName })
    }).catch(() => undefined);
  }

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="chat-header">
          <h1>Nutri AI India</h1>
          <p>Slice 1 meal logging prototype</p>
        </header>
        <div className="chat-body">
          <div className="bubble system">Tell me what you ate, and I will prepare an estimate for review.</div>
          {review && <div className="bubble user">{review.inputText}</div>}
          {lastConfirmed && <div className="bubble system">{lastConfirmed}</div>}
          {review && (
            <MealReview
              review={review}
              isSaving={isSaving}
              onChange={setReview}
              onConfirm={confirmMeal}
              onCorrection={recordCorrection}
            />
          )}
          {error && <div className="error">{error}</div>}
        </div>
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            void interpretMeal();
          }}
        >
          <input
            aria-label="Meal description"
            placeholder="Example: 2 rotis, black chana sabzi and 200g cooked rice"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={!canSubmit}>
            {isInterpreting ? "Estimating..." : "Estimate"}
          </button>
        </form>
      </section>
      <DailyTotals totals={totals} mealCount={mealCount} />
    </main>
  );
}
