"use client";

import type { MealReview as MealReviewType, QuantityUnit } from "@/domain/meal/types";

const quantityUnits: QuantityUnit[] = ["piece", "g", "ml", "serving", "unknown"];

export function MealReview({
  review,
  isSaving,
  onChange,
  onConfirm,
  onCorrection
}: {
  review: MealReviewType;
  isSaving: boolean;
  onChange: (review: MealReviewType) => void;
  onConfirm: () => void;
  onCorrection: (field: string, itemName: string) => void;
}) {
  function updateItem(index: number, updater: (item: MealReviewType["items"][number]) => MealReviewType["items"][number]) {
    const items = review.items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
    onChange(recalculateClientReview({ ...review, items }));
  }

  return (
    <section className="review">
      <h2>Review meal</h2>
      {review.items.map((item, index) => (
        <div className="review-row" key={`${item.name}-${index}`}>
          <input
            aria-label="Food name"
            value={item.name}
            onBlur={() => onCorrection("name", item.name)}
            onChange={(event) =>
              updateItem(index, (current) => ({
                ...current,
                name: event.target.value
              }))
            }
          />
          <input
            aria-label="Quantity"
            inputMode="decimal"
            value={item.quantity.value ?? ""}
            onBlur={() => onCorrection("quantity", item.name)}
            onChange={(event) =>
              updateItem(index, (current) => ({
                ...current,
                quantity: {
                  ...current.quantity,
                  value: event.target.value ? Number(event.target.value) : null,
                  originalText: event.target.value
                    ? `${event.target.value} ${current.quantity.unit}`
                    : current.quantity.originalText
                }
              }))
            }
          />
          <select
            aria-label="Quantity unit"
            value={item.quantity.unit}
            onBlur={() => onCorrection("unit", item.name)}
            onChange={(event) =>
              updateItem(index, (current) => ({
                ...current,
                quantity: {
                  ...current.quantity,
                  unit: event.target.value as QuantityUnit
                }
              }))
            }
          >
            {quantityUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <div>
            <div className="macro-line">
              {Math.round(item.calories)} cal | {item.proteinGrams.toFixed(1)}g protein
            </div>
            <span className="label">{item.uncertainty}</span>
          </div>
        </div>
      ))}
      <div className="notes">
        Total: {Math.round(review.totals.calories)} cal | {review.totals.proteinGrams.toFixed(1)}g protein |{" "}
        {review.totals.carbsGrams.toFixed(1)}g carbs | {review.totals.fatGrams.toFixed(1)}g fat
      </div>
      {review.overallNotes.length > 0 && <p className="notes">{review.overallNotes.join(" ")}</p>}
      <div className="review-actions">
        <button className="primary-button" onClick={onConfirm} disabled={isSaving}>
          {isSaving ? "Saving..." : "Confirm meal"}
        </button>
      </div>
    </section>
  );
}

function recalculateClientReview(review: MealReviewType): MealReviewType {
  const items = review.items.map((item) => {
    const scale = item.quantity.value && item.quantity.value > 0 ? item.quantity.value : 1;
    const originalScale = inferOriginalScale(item.quantity.originalText, item.quantity.unit) || scale;
    const factor = originalScale > 0 ? scale / originalScale : 1;

    return {
      ...item,
      calories: round(item.calories * factor),
      proteinGrams: round(item.proteinGrams * factor),
      carbsGrams: round(item.carbsGrams * factor),
      fatGrams: round(item.fatGrams * factor)
    };
  });

  return {
    ...review,
    items,
    totals: {
      calories: round(items.reduce((sum, item) => sum + item.calories, 0)),
      proteinGrams: round(items.reduce((sum, item) => sum + item.proteinGrams, 0)),
      carbsGrams: round(items.reduce((sum, item) => sum + item.carbsGrams, 0)),
      fatGrams: round(items.reduce((sum, item) => sum + item.fatGrams, 0))
    }
  };
}

function inferOriginalScale(originalText: string, unit: QuantityUnit) {
  const match = originalText.match(/(\d+(\.\d+)?)/);
  if (!match) {
    return unit === "serving" || unit === "piece" ? 1 : null;
  }
  return Number(match[1]);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
