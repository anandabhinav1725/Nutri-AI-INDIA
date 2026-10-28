import { mockMealInterpreter } from "@/domain/ai/mockInterpreter";
import { createMealReview } from "@/domain/meal/mealWorkflow";
import { interpretMealRequestSchema } from "@/domain/meal/schemas";
import { jsonFailure, jsonOk } from "@/lib/api/responses";
import { logger } from "@/lib/logger";
import { productEvents, recordProductEvent } from "@/lib/validation/events";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = interpretMealRequestSchema.parse(await request.json());

    await recordProductEvent({
      browserTesterId: body.testerId,
      eventName: productEvents.mealLoggingStarted,
      metadata: { inputLength: body.message.length }
    });
    logger.info("Meal logging started", {
      testerId: body.testerId,
      inputLength: body.message.length
    });

    const review = await createMealReview({
      testerId: body.testerId,
      message: body.message,
      interpreter: mockMealInterpreter
    });

    await recordProductEvent({
      browserTesterId: body.testerId,
      eventName: productEvents.mealInterpretationCompleted,
      metadata: {
        itemCount: review.items.length,
        hasLowConfidence: review.items.some((item) => item.uncertainty === "Low confidence")
      }
    });
    logger.info("Meal interpretation completed", {
      testerId: body.testerId,
      itemCount: review.items.length
    });

    return jsonOk({ review });
  } catch (error) {
    return jsonFailure({
      logMessage: "Meal interpretation failed",
      userMessage: "I could not interpret that meal. Please try a simpler description.",
      error
    });
  }
}
