import type { QuantityUnit, UncertaintyLabel } from "@/domain/meal/types";

export type CuratedFood = {
  key: string;
  aliases: string[];
  basis: {
    value: number;
    unit: QuantityUnit;
  };
  macros: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  defaultUncertainty: UncertaintyLabel;
};

export const curatedFoods: CuratedFood[] = [
  {
    key: "roti",
    aliases: ["roti", "rotis", "chapati"],
    basis: {
      value: 1,
      unit: "piece"
    },
    macros: {
      calories: 110,
      proteinGrams: 3.5,
      carbsGrams: 18,
      fatGrams: 3
    },
    defaultUncertainty: "Estimated"
  },
  {
    key: "black chana sabzi",
    aliases: ["black chana sabzi", "black chana sabji", "kala chana sabzi", "chana sabzi"],
    basis: {
      value: 1,
      unit: "serving"
    },
    macros: {
      calories: 220,
      proteinGrams: 10,
      carbsGrams: 32,
      fatGrams: 6
    },
    defaultUncertainty: "Estimated"
  },
  {
    key: "cooked rice",
    aliases: ["cooked rice", "rice", "white rice"],
    basis: {
      value: 100,
      unit: "g"
    },
    macros: {
      calories: 130,
      proteinGrams: 2.7,
      carbsGrams: 28,
      fatGrams: 0.3
    },
    defaultUncertainty: "Estimated"
  }
];
