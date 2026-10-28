import { z } from "zod";

export const quantityUnitSchema = z.enum(["piece", "g", "ml", "serving", "unknown"]);

export const interpretedMealItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.object({
    value: z.number().positive().nullable(),
    unit: quantityUnitSchema,
    originalText: z.string().min(1)
  }),
  assumptions: z.array(z.string()),
  needsClarification: z.boolean()
});

export const interpretedMealSchema = z.object({
  items: z.array(interpretedMealItemSchema).min(1),
  overallNotes: z.array(z.string())
});

export const resolvedMealItemSchema = interpretedMealItemSchema.extend({
  calories: z.number().nonnegative(),
  proteinGrams: z.number().nonnegative(),
  carbsGrams: z.number().nonnegative(),
  fatGrams: z.number().nonnegative(),
  uncertainty: z.enum(["Estimated", "Low confidence"])
});

export const mealReviewSchema = z.object({
  inputText: z.string().min(1),
  items: z.array(resolvedMealItemSchema).min(1),
  totals: z.object({
    calories: z.number().nonnegative(),
    proteinGrams: z.number().nonnegative(),
    carbsGrams: z.number().nonnegative(),
    fatGrams: z.number().nonnegative()
  }),
  overallNotes: z.array(z.string())
});

export const interpretMealRequestSchema = z.object({
  testerId: z.string().min(1),
  message: z.string().min(1)
});

export const confirmMealRequestSchema = z.object({
  testerId: z.string().min(1),
  startedAt: z.string().datetime().optional(),
  review: mealReviewSchema
});
