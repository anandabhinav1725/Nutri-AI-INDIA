export type QuantityUnit = "piece" | "g" | "ml" | "serving" | "unknown";

export type UncertaintyLabel = "Estimated" | "Low confidence";

export type InterpretedMealItem = {
  name: string;
  quantity: {
    value: number | null;
    unit: QuantityUnit;
    originalText: string;
  };
  assumptions: string[];
  needsClarification: boolean;
};

export type InterpretedMeal = {
  items: InterpretedMealItem[];
  overallNotes: string[];
};

export type ResolvedMealItem = InterpretedMealItem & {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  uncertainty: UncertaintyLabel;
};

export type MealReview = {
  inputText: string;
  items: ResolvedMealItem[];
  totals: MacroTotals;
  overallNotes: string[];
};

export type MacroTotals = {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};
