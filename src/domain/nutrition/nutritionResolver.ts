import { curatedFoods } from "@/domain/nutrition/curatedFoods";
import type {
  InterpretedMealItem,
  MacroTotals,
  ResolvedMealItem
} from "@/domain/meal/types";

const unknownFoodFallback = {
  calories: 250,
  proteinGrams: 6,
  carbsGrams: 30,
  fatGrams: 9
};

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}

function findCuratedFood(name: string) {
  const normalized = name.toLowerCase().trim();
  return curatedFoods.find((food) => food.aliases.includes(normalized));
}

function scaleForQuantity(item: InterpretedMealItem, food: NonNullable<ReturnType<typeof findCuratedFood>>) {
  const quantityValue = item.quantity.value ?? food.basis.value;

  if (item.quantity.unit === food.basis.unit) {
    return quantityValue / food.basis.value;
  }

  if (item.quantity.unit === "unknown") {
    return 1;
  }

  return 1;
}

export function resolveMealItemNutrition(item: InterpretedMealItem): ResolvedMealItem {
  const food = findCuratedFood(item.name);

  if (!food) {
    return {
      ...item,
      calories: unknownFoodFallback.calories,
      proteinGrams: unknownFoodFallback.proteinGrams,
      carbsGrams: unknownFoodFallback.carbsGrams,
      fatGrams: unknownFoodFallback.fatGrams,
      uncertainty: "Low confidence",
      assumptions: [
        ...item.assumptions,
        "Used a generic fallback estimate because this food is not in the curated Slice 1 dataset."
      ]
    };
  }

  const scale = scaleForQuantity(item, food);

  return {
    ...item,
    calories: roundMacro(food.macros.calories * scale),
    proteinGrams: roundMacro(food.macros.proteinGrams * scale),
    carbsGrams: roundMacro(food.macros.carbsGrams * scale),
    fatGrams: roundMacro(food.macros.fatGrams * scale),
    uncertainty: item.quantity.value ? food.defaultUncertainty : "Low confidence"
  };
}

export function resolveMealNutrition(items: InterpretedMealItem[]) {
  const resolvedItems = items.map(resolveMealItemNutrition);
  return {
    items: resolvedItems,
    totals: calculateTotals(resolvedItems)
  };
}

export function calculateTotals(items: Array<Pick<ResolvedMealItem, "calories" | "proteinGrams" | "carbsGrams" | "fatGrams">>): MacroTotals {
  return {
    calories: roundMacro(items.reduce((sum, item) => sum + item.calories, 0)),
    proteinGrams: roundMacro(items.reduce((sum, item) => sum + item.proteinGrams, 0)),
    carbsGrams: roundMacro(items.reduce((sum, item) => sum + item.carbsGrams, 0)),
    fatGrams: roundMacro(items.reduce((sum, item) => sum + item.fatGrams, 0))
  };
}
