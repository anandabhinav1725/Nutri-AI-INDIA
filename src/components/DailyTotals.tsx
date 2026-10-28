import type { MacroTotals } from "@/domain/meal/types";

export function DailyTotals({ totals, mealCount }: { totals: MacroTotals; mealCount: number }) {
  return (
    <aside className="totals">
      <h2>Today</h2>
      <div className="total-grid">
        <div className="total-tile">
          <div className="total-value">{Math.round(totals.calories)}</div>
          <div className="total-label">Calories</div>
        </div>
        <div className="total-tile">
          <div className="total-value">{totals.proteinGrams.toFixed(1)}g</div>
          <div className="total-label">Protein</div>
        </div>
        <div className="total-tile">
          <div className="total-value">{totals.carbsGrams.toFixed(1)}g</div>
          <div className="total-label">Carbs</div>
        </div>
        <div className="total-tile">
          <div className="total-value">{totals.fatGrams.toFixed(1)}g</div>
          <div className="total-label">Fat</div>
        </div>
      </div>
      <p className="notes">{mealCount} confirmed meal{mealCount === 1 ? "" : "s"} today.</p>
    </aside>
  );
}
