import type { InterpretedMeal } from "@/domain/meal/types";

export type InterpretMealInput = {
  testerId: string;
  message: string;
};

export interface MealInterpreter {
  interpretMeal(input: InterpretMealInput): Promise<InterpretedMeal>;
}
