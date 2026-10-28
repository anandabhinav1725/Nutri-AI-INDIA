import { db } from "@/lib/db";
import { ensureTester } from "@/lib/testerRepository";
import type { MealReview } from "@/domain/meal/types";

export async function createConfirmedMeal(params: {
  browserTesterId: string;
  review: MealReview;
}) {
  const tester = await ensureTester(params.browserTesterId);

  return db.meal.create({
    data: {
      testerId: tester.id,
      inputText: params.review.inputText,
      calories: params.review.totals.calories,
      proteinGrams: params.review.totals.proteinGrams,
      carbsGrams: params.review.totals.carbsGrams,
      fatGrams: params.review.totals.fatGrams,
      items: {
        create: params.review.items.map((item) => ({
          name: item.name,
          quantityValue: item.quantity.value,
          quantityUnit: item.quantity.unit,
          quantityOriginalText: item.quantity.originalText,
          calories: item.calories,
          proteinGrams: item.proteinGrams,
          carbsGrams: item.carbsGrams,
          fatGrams: item.fatGrams,
          uncertainty: item.uncertainty,
          assumptions: item.assumptions
        }))
      }
    },
    include: {
      items: true
    }
  });
}

export async function findMealsConfirmedToday(browserTesterId: string, now = new Date()) {
  const tester = await ensureTester(browserTesterId);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return db.meal.findMany({
    where: {
      testerId: tester.id,
      confirmedAt: {
        gte: startOfDay
      }
    }
  });
}
