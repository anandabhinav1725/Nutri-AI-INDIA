import { beforeEach, describe, expect, it, vi } from "vitest";

const mealCreate = vi.fn();
const mealFindMany = vi.fn();
const testerUpsert = vi.fn();
const productEventCreate = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    tester: {
      upsert: testerUpsert
    },
    productEvent: {
      create: productEventCreate
    },
    meal: {
      create: mealCreate,
      findMany: mealFindMany
    }
  }
}));

describe("API flow", () => {
  beforeEach(() => {
    testerUpsert.mockResolvedValue({ id: "tester-db-1", browserId: "browser-1" });
    productEventCreate.mockResolvedValue({ id: "event-1" });
    mealCreate.mockResolvedValue({
      id: "meal-1",
      items: [{ id: "item-1" }]
    });
    mealFindMany.mockResolvedValue([
      {
        calories: 700,
        proteinGrams: 22.4,
        carbsGrams: 124,
        fatGrams: 12.6
      }
    ]);
    vi.clearAllMocks();
  });

  it("interpret endpoint returns a review payload and records events", async () => {
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(
      new Request("http://localhost/api/meal/interpret", {
        method: "POST",
        body: JSON.stringify({
          testerId: "browser-1",
          message: "I ate 2 rotis, black chana sabzi and 200g cooked rice."
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.review.items).toHaveLength(3);
    expect(productEventCreate).toHaveBeenCalledTimes(2);
  });

  it("confirm endpoint persists the meal and records confirmation", async () => {
    const { POST: interpretPost } = await import("@/app/api/meal/interpret/route");
    const { POST: confirmPost } = await import("@/app/api/meal/confirm/route");
    const interpreted = await interpretPost(
      new Request("http://localhost/api/meal/interpret", {
        method: "POST",
        body: JSON.stringify({
          testerId: "browser-1",
          message: "I ate 2 rotis, black chana sabzi and 200g cooked rice."
        })
      })
    );
    const { review } = await interpreted.json();

    const response = await confirmPost(
      new Request("http://localhost/api/meal/confirm", {
        method: "POST",
        body: JSON.stringify({
          testerId: "browser-1",
          review
        })
      })
    );

    expect(response.status).toBe(200);
    expect(mealCreate).toHaveBeenCalledOnce();
    expect(productEventCreate).toHaveBeenCalled();
  });

  it("today totals endpoint returns persisted totals", async () => {
    const { GET } = await import("@/app/api/totals/today/route");
    const response = await GET(new Request("http://localhost/api/totals/today?testerId=browser-1"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.totals.calories).toBe(700);
    expect(payload.mealCount).toBe(1);
  });
});
