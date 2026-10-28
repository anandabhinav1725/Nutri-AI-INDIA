import type { MealInterpreter } from "@/domain/ai/interpreter";
import { interpretedMealSchema, mealReviewSchema } from "@/domain/meal/schemas";
import type { MealReview } from "@/domain/meal/types";
import { resolveMealNutrition } from "@/domain/nutrition/nutritionResolver";

export async function createMealReview(params: {
  testerId: string;
  message: string;
  interpreter: MealInterpreter;
}): Promise<MealReview> {
  const interpreted = interpretedMealSchema.parse(
    await params.interpreter.interpretMeal({
      testerId: params.testerId,
      message: params.message
    })
  );
  const resolved = resolveMealNutrition(interpreted.items);

  return mealReviewSchema.parse({
    inputText: params.message,
    items: resolved.items,
    totals: resolved.totals,
    overallNotes: interpreted.overallNotes
  });
}

export function recalculateMealReview(review: MealReview): MealReview {
  const resolved = resolveMealNutrition(review.items);

  return mealReviewSchema.parse({
    ...review,
    items: resolved.items,
    totals: resolved.totals
  });
}
