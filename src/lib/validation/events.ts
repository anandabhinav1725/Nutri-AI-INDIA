import { db } from "@/lib/db";
import { ensureTester } from "@/lib/testerRepository";
import type { Prisma } from "@prisma/client";

export const productEvents = {
  mealLoggingStarted: "meal_logging_started",
  mealInterpretationCompleted: "meal_interpretation_completed",
  userCorrectionMade: "user_correction_made",
  mealConfirmed: "meal_confirmed",
  mealAbandoned: "meal_abandoned"
} as const;

export type ProductEventName = (typeof productEvents)[keyof typeof productEvents];

export async function recordProductEvent(params: {
  browserTesterId: string;
  eventName: ProductEventName;
  metadata?: Prisma.InputJsonValue;
}) {
  const tester = await ensureTester(params.browserTesterId);

  return db.productEvent.create({
    data: {
      testerId: tester.id,
      eventName: params.eventName,
      metadata: params.metadata ?? {}
    }
  });
}
