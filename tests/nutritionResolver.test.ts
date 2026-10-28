import { describe, expect, it } from "vitest";
import { resolveMealItemNutrition, resolveMealNutrition } from "@/domain/nutrition/nutritionResolver";

describe("nutritionResolver", () => {
  it("resolves roti by piece", () => {
    const item = resolveMealItemNutrition({
      name: "roti",
      quantity: { value: 2, unit: "piece", originalText: "2 rotis" },
      assumptions: [],
      needsClarification: false
    });

    expect(item.calories).toBe(220);
    expect(item.proteinGrams).toBe(7);
    expect(item.uncertainty).toBe("Estimated");
  });

  it("resolves cooked rice by grams", () => {
    const item = resolveMealItemNutrition({
      name: "cooked rice",
      quantity: { value: 200, unit: "g", originalText: "200g cooked rice" },
      assumptions: [],
      needsClarification: false
    });

    expect(item.calories).toBe(260);
    expect(item.carbsGrams).toBe(56);
  });

  it("resolves black chana sabzi by serving", () => {
    const item = resolveMealItemNutrition({
      name: "black chana sabzi",
      quantity: { value: 1, unit: "serving", originalText: "black chana sabzi" },
      assumptions: ["Quantity was not specified; estimated as 1 serving."],
      needsClarification: false
    });

    expect(item.calories).toBe(220);
    expect(item.uncertainty).toBe("Estimated");
  });

  it("marks unknown foods as low confidence", () => {
    const item = resolveMealItemNutrition({
      name: "unknown snack",
      quantity: { value: null, unit: "unknown", originalText: "unknown snack" },
      assumptions: [],
      needsClarification: true
    });

    expect(item.uncertainty).toBe("Low confidence");
    expect(item.assumptions.join(" ")).toContain("generic fallback");
  });

  it("calculates meal totals", () => {
    const meal = resolveMealNutrition([
      {
        name: "roti",
        quantity: { value: 2, unit: "piece", originalText: "2 rotis" },
        assumptions: [],
        needsClarification: false
      },
      {
        name: "cooked rice",
        quantity: { value: 200, unit: "g", originalText: "200g cooked rice" },
        assumptions: [],
        needsClarification: false
      }
    ]);

    expect(meal.totals.calories).toBe(480);
  });
});
