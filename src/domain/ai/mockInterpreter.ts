import { interpretedMealSchema } from "@/domain/meal/schemas";
import type { MealInterpreter } from "@/domain/ai/interpreter";

export const mockMealInterpreter: MealInterpreter = {
  async interpretMeal({ message }) {
    const normalized = message.toLowerCase();

    if (
      normalized.includes("roti") &&
      normalized.includes("chana") &&
      normalized.includes("rice")
    ) {
      return interpretedMealSchema.parse({
        items: [
          {
            name: "roti",
            quantity: {
              value: 2,
              unit: "piece",
              originalText: "2 rotis"
            },
            assumptions: ["Assumed medium homemade rotis."],
            needsClarification: false
          },
          {
            name: "black chana sabzi",
            quantity: {
              value: 1,
              unit: "serving",
              originalText: "black chana sabzi"
            },
            assumptions: ["Quantity was not specified; estimated as 1 serving."],
            needsClarification: false
          },
          {
            name: "cooked rice",
            quantity: {
              value: 200,
              unit: "g",
              originalText: "200g cooked rice"
            },
            assumptions: ["Assumed plain cooked white rice."],
            needsClarification: false
          }
        ],
        overallNotes: ["Estimated where exact recipe or portion size was not provided."]
      });
    }

    return interpretedMealSchema.parse({
      items: [
        {
          name: message.trim(),
          quantity: {
            value: null,
            unit: "unknown",
            originalText: message.trim()
          },
          assumptions: ["Food was not recognized by the Slice 1 mock interpreter."],
          needsClarification: true
        }
      ],
      overallNotes: ["Low confidence estimate because this food is outside the Slice 1 mock parser."]
    });
  }
};
