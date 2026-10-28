import { describe, expect, it } from "vitest";
import { mockMealInterpreter } from "@/domain/ai/mockInterpreter";
import { interpretedMealSchema } from "@/domain/meal/schemas";

describe("mockMealInterpreter", () => {
  it("parses the approved Slice 1 test meal deterministically", async () => {
    const result = await mockMealInterpreter.interpretMeal({
      testerId: "tester-1",
      message: "I ate 2 rotis, black chana sabzi and 200g cooked rice."
    });

    expect(() => interpretedMealSchema.parse(result)).not.toThrow();
    expect(result.items).toHaveLength(3);
    expect(result.items[0].name).toBe("roti");
    expect(result.items[0].quantity).toMatchObject({ value: 2, unit: "piece" });
    expect(result.items[1].name).toBe("black chana sabzi");
    expect(result.items[1].assumptions.join(" ")).toContain("Quantity was not specified");
    expect(result.items[2].quantity).toMatchObject({ value: 200, unit: "g" });
  });

  it("falls back with clarification needed for unsupported inputs", async () => {
    const result = await mockMealInterpreter.interpretMeal({
      testerId: "tester-1",
      message: "mystery dinner"
    });

    expect(result.items[0].needsClarification).toBe(true);
  });
});
