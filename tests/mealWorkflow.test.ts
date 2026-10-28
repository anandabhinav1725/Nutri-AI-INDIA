import { describe, expect, it } from "vitest";
import { mockMealInterpreter } from "@/domain/ai/mockInterpreter";
import { createMealReview, recalculateMealReview } from "@/domain/meal/mealWorkflow";

describe("mealWorkflow", () => {
  it("creates an editable meal review with totals", async () => {
    const review = await createMealReview({
      testerId: "tester-1",
      message: "I ate 2 rotis, black chana sabzi and 200g cooked rice.",
      interpreter: mockMealInterpreter
    });

    expect(review.items).toHaveLength(3);
    expect(review.totals.calories).toBe(700);
    expect(review.items.some((item) => item.name === "black chana sabzi")).toBe(true);
  });

  it("recalculates totals after a corrected quantity", async () => {
    const review = await createMealReview({
      testerId: "tester-1",
      message: "I ate 2 rotis, black chana sabzi and 200g cooked rice.",
      interpreter: mockMealInterpreter
    });
    const corrected = {
      ...review,
      items: review.items.map((item) =>
        item.name === "roti"
          ? {
              ...item,
              quantity: {
                ...item.quantity,
                value: 3,
                originalText: "3 piece"
              }
            }
          : item
      )
    };

    const recalculated = recalculateMealReview(corrected);

    expect(recalculated.items.find((item) => item.name === "roti")?.calories).toBe(330);
    expect(recalculated.totals.calories).toBe(810);
  });
});
