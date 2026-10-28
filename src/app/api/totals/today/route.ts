import { findMealsConfirmedToday } from "@/domain/meal/mealRepository";
import { calculateTotals } from "@/domain/nutrition/nutritionResolver";
import { jsonFailure, jsonOk, jsonWithStatus } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const testerId = url.searchParams.get("testerId");

    if (!testerId) {
      return jsonWithStatus({ error: "Missing tester identity." }, 400);
    }

    const meals = await findMealsConfirmedToday(testerId);

    return jsonOk({
      totals: calculateTotals(meals),
      mealCount: meals.length
    });
  } catch (error) {
    return jsonFailure({
      logMessage: "Daily totals lookup failed",
      userMessage: "I could not load today's totals.",
      error
    });
  }
}
