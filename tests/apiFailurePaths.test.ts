import { beforeEach, describe, expect, it, vi } from "vitest";

const mealCreate = vi.fn();
const mealFindMany = vi.fn();
const testerUpsert = vi.fn();
const productEventCreate = vi.fn();
const interpretMeal = vi.fn();
const loggerError = vi.fn();
const loggerInfo = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    tester: { upsert: testerUpsert },
    productEvent: { create: productEventCreate },
    meal: { create: mealCreate, findMany: mealFindMany }
  }
}));

vi.mock("@/domain/ai/mockInterpreter", () => ({
  mockMealInterpreter: { interpretMeal }
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: loggerError,
    info: loggerInfo,
    warn: vi.fn()
  }
}));

const interpretedMeal = {
  items: [
    {
      name: "roti",
      quantity: { value: 2, unit: "piece", originalText: "2 rotis" },
      assumptions: ["Assumed medium homemade rotis."],
      needsClarification: false
    }
  ],
  overallNotes: []
};

const validReview = {
  inputText: "I ate 2 rotis.",
  items: [
    {
      ...interpretedMeal.items[0],
      calories: 220,
      proteinGrams: 7,
      carbsGrams: 36,
      fatGrams: 6,
      uncertainty: "Estimated"
    }
  ],
  totals: {
    calories: 220,
    proteinGrams: 7,
    carbsGrams: 36,
    fatGrams: 6
  },
  overallNotes: []
};

function post(url: string, body: string) {
  return new Request(url, { method: "POST", body });
}

function expectGenericFailure(payload: unknown, message: string) {
  expect(payload).toEqual({ error: message });
}

beforeEach(() => {
  vi.resetAllMocks();
  testerUpsert.mockResolvedValue({ id: "tester-db-1", browserId: "browser-1" });
  productEventCreate.mockResolvedValue({ id: "event-1" });
  mealCreate.mockResolvedValue({ id: "meal-1", items: [{ id: "item-1" }] });
  mealFindMany.mockResolvedValue([]);
  interpretMeal.mockResolvedValue(interpretedMeal);
});

describe("meal interpretation failure paths", () => {
  it("rejects missing required fields without writing events or meals", async () => {
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(post("http://localhost/api/meal/interpret", JSON.stringify({ testerId: "browser-1" })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not interpret that meal. Please try a simpler description.");
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(mealCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects invalid payload types", async () => {
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(post("http://localhost/api/meal/interpret", JSON.stringify({ testerId: 1, message: {} })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not interpret that meal. Please try a simpler description.");
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects malformed JSON", async () => {
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(post("http://localhost/api/meal/interpret", "{"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not interpret that meal. Please try a simpler description.");
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("handles interpreter failures without persisting a meal", async () => {
    interpretMeal.mockRejectedValueOnce(new Error("interpreter unavailable"));
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(
      post("http://localhost/api/meal/interpret", JSON.stringify({ testerId: "browser-1", message: "2 rotis" }))
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expectGenericFailure(payload, "I could not interpret that meal. Please try a simpler description.");
    expect(productEventCreate).toHaveBeenCalledOnce();
    expect(mealCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("fails safely when the completion event cannot be stored", async () => {
    productEventCreate.mockResolvedValueOnce({ id: "event-1" }).mockRejectedValueOnce(new Error("event database unavailable"));
    const { POST } = await import("@/app/api/meal/interpret/route");
    const response = await POST(
      post("http://localhost/api/meal/interpret", JSON.stringify({ testerId: "browser-1", message: "2 rotis" }))
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expectGenericFailure(payload, "I could not interpret that meal. Please try a simpler description.");
    expect(productEventCreate).toHaveBeenCalledTimes(2);
    expect(mealCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });
});

describe("meal confirmation failure paths", () => {
  it("rejects missing required fields without saving a meal", async () => {
    const { POST } = await import("@/app/api/meal/confirm/route");
    const response = await POST(post("http://localhost/api/meal/confirm", JSON.stringify({ testerId: "browser-1" })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not save that meal. Please try confirming again.");
    expect(mealCreate).not.toHaveBeenCalled();
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects invalid confirmation payloads", async () => {
    const { POST } = await import("@/app/api/meal/confirm/route");
    const response = await POST(
      post("http://localhost/api/meal/confirm", JSON.stringify({ testerId: "browser-1", review: { items: [] } }))
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not save that meal. Please try confirming again.");
    expect(mealCreate).not.toHaveBeenCalled();
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects malformed JSON without saving a meal", async () => {
    const { POST } = await import("@/app/api/meal/confirm/route");
    const response = await POST(post("http://localhost/api/meal/confirm", "{"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expectGenericFailure(payload, "I could not save that meal. Please try confirming again.");
    expect(mealCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("returns a safe failure when meal persistence fails", async () => {
    mealCreate.mockRejectedValueOnce(new Error("meal database unavailable"));
    const { POST } = await import("@/app/api/meal/confirm/route");
    const response = await POST(
      post("http://localhost/api/meal/confirm", JSON.stringify({ testerId: "browser-1", review: validReview }))
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expectGenericFailure(payload, "I could not save that meal. Please try confirming again.");
    expect(mealCreate).toHaveBeenCalledOnce();
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("returns success after persistence when the confirmation event cannot be stored", async () => {
    productEventCreate.mockRejectedValueOnce(new Error("event database unavailable"));
    const { POST } = await import("@/app/api/meal/confirm/route");
    const response = await POST(
      post("http://localhost/api/meal/confirm", JSON.stringify({ testerId: "browser-1", review: validReview }))
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ meal: { id: "meal-1", items: [{ id: "item-1" }] } });
    expect(mealCreate).toHaveBeenCalledOnce();
    expect(productEventCreate).toHaveBeenCalledOnce();
    expect(loggerError).toHaveBeenCalledOnce();
  });
});

describe("daily totals failure paths", () => {
  it("rejects requests without a tester identity", async () => {
    const { GET } = await import("@/app/api/totals/today/route");
    const response = await GET(new Request("http://localhost/api/totals/today"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: "Missing tester identity." });
    expect(mealFindMany).not.toHaveBeenCalled();
    expect(loggerError).not.toHaveBeenCalled();
  });

  it("hides database query errors from the response", async () => {
    mealFindMany.mockRejectedValueOnce(new Error("database host is unavailable"));
    const { GET } = await import("@/app/api/totals/today/route");
    const response = await GET(new Request("http://localhost/api/totals/today?testerId=browser-1"));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expectGenericFailure(payload, "I could not load today's totals.");
    expect(JSON.stringify(payload)).not.toContain("database host is unavailable");
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("hides tester repository errors from the response", async () => {
    testerUpsert.mockRejectedValueOnce(new Error("tester repository unavailable"));
    const { GET } = await import("@/app/api/totals/today/route");
    const response = await GET(new Request("http://localhost/api/totals/today?testerId=browser-1"));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expectGenericFailure(payload, "I could not load today's totals.");
    expect(JSON.stringify(payload)).not.toContain("tester repository unavailable");
    expect(mealFindMany).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });
});

describe("correction event failure paths", () => {
  it("rejects missing required fields", async () => {
    const { POST } = await import("@/app/api/events/correction/route");
    const response = await POST(post("http://localhost/api/events/correction", JSON.stringify({ testerId: "browser-1" })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ ok: false });
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects invalid payload types", async () => {
    const { POST } = await import("@/app/api/events/correction/route");
    const response = await POST(
      post("http://localhost/api/events/correction", JSON.stringify({ testerId: 1, field: {}, itemName: null }))
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ ok: false });
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("rejects malformed JSON", async () => {
    const { POST } = await import("@/app/api/events/correction/route");
    const response = await POST(post("http://localhost/api/events/correction", "{"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ ok: false });
    expect(productEventCreate).not.toHaveBeenCalled();
    expect(loggerError).toHaveBeenCalledOnce();
  });

  it("returns the existing failure shape when event persistence fails", async () => {
    productEventCreate.mockRejectedValueOnce(new Error("event database unavailable"));
    const { POST } = await import("@/app/api/events/correction/route");
    const response = await POST(
      post(
        "http://localhost/api/events/correction",
        JSON.stringify({ testerId: "browser-1", field: "quantity", itemName: "roti" })
      )
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({ ok: false });
    expect(loggerError).toHaveBeenCalledOnce();
  });
});
