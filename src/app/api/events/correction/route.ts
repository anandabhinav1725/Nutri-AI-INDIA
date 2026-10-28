import { z } from "zod";
import { jsonOk, jsonWithStatus, statusForError } from "@/lib/api/responses";
import { logger } from "@/lib/logger";
import { productEvents, recordProductEvent } from "@/lib/validation/events";

export const dynamic = "force-dynamic";

const correctionEventRequestSchema = z.object({
  testerId: z.string().min(1),
  field: z.string().min(1),
  itemName: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = correctionEventRequestSchema.parse(await request.json());

    await recordProductEvent({
      browserTesterId: body.testerId,
      eventName: productEvents.userCorrectionMade,
      metadata: {
        field: body.field,
        itemName: body.itemName
      }
    });
    logger.info("User correction recorded", {
      testerId: body.testerId,
      field: body.field,
      itemName: body.itemName
    });

    return jsonOk({ ok: true });
  } catch (error) {
    logger.error("Correction event failed", error);
    return jsonWithStatus({ ok: false }, statusForError(error));
  }
}
