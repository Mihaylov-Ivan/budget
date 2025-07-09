import Dropdown from "./components/dropdown";
import YearlyMoneyDistribution from "./sections/yearly-money-distribution";
import Subpages from "./sections/subpages";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col gap-8">
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
