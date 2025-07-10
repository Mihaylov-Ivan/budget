import { getBudgetData } from "./actions";
import Dropdown from "./components/dropdown";
import Subpages from "./sections/subpages";
import YearlyMoneyDistribution from "./sections/yearly-money-distribution";

export default async function Home() {
  // Fetch data from MongoDB
  const budgetData = await getBudgetData();
  // For now we don't use budgetData in the UI, but it's available here
  console.log(budgetData);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Personal Budget Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Month:</span>
          <Dropdown />
        </div>
      </header>

      {/* Sections */}
      <YearlyMoneyDistribution />
      <Subpages />
    </div>
  );
}
