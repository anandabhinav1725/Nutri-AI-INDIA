import { createConfirmedMeal } from "@/domain/meal/mealRepository";
import { confirmMealRequestSchema } from "@/domain/meal/schemas";
import { jsonFailure, jsonOk } from "@/lib/api/responses";
import { logger } from "@/lib/logger";
import { productEvents, recordProductEvent } from "@/lib/validation/events";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = confirmMealRequestSchema.parse(await request.json());
    const meal = await createConfirmedMeal({
      browserTesterId: body.testerId,
      review: body.review
    });

    const elapsedMs = body.startedAt ? Date.now() - new Date(body.startedAt).getTime() : null;
    await recordProductEvent({
      browserTesterId: body.testerId,
      eventName: productEvents.mealConfirmed,
      metadata: {
        mealId: meal.id,
        itemCount: meal.items.length,
        elapsedMs
      }
    });
    logger.info("Meal confirmed", {
      testerId: body.testerId,
      mealId: meal.id,
      itemCount: meal.items.length,
      elapsedMs
    });

    return jsonOk({ meal });
  } catch (error) {
    return jsonFailure({
      logMessage: "Meal confirmation failed",
      userMessage: "I could not save that meal. Please try confirming again.",
      error
    });
  }
}
