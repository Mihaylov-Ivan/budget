// Yearly money distribution -------------------------------------------------
export const yearlyDistribution = {
  receivedIncome: 7870.45,
  shouldHave: 16471.97,
  actuallyHave: 16471.97,
  extra: 0.0,
};

// Helper types --------------------------------------------------------------
export type YearlyCardColor = "blue" | "orange" | "green" | "purple";

export type YearlyCardData = {
  id: string;
  title: string;
  value: number;
  description: string;
  color: YearlyCardColor;
};

// Map the distribution object into the card data expected by the UI
export const yearlyCards: YearlyCardData[] = [
  {
    id: "received",
    title: "Received Income",
    value: yearlyDistribution.receivedIncome,
    description: "Total received income to date",
    color: "blue",
  },
  {
    id: "should-have",
    title: "Should Have",
    value: yearlyDistribution.shouldHave,
    description: "Fixed savings + expense savings + current month budget",
    color: "orange",
  },
  {
    id: "actually-have",
    title: "Actually Have",
    value: yearlyDistribution.actuallyHave,
    description: "Cash + accounts + investments + debt",
    color: "green",
  },
  {
    id: "extra",
    title: "Extra",
    value: yearlyDistribution.extra,
    description: "Difference between should have and actually have",
    color: "purple",
  },
];

// Fixed savings -------------------------------------------------------------
export type FixedSavings = {
  name: string;
  total: number | "Unlimited";
  saved: number;
  used: number;
  available: number;
};

export const fixedSavings: FixedSavings[] = [
  { name: "Emergency", total: 1000, saved: 0, used: 0, available: 0 },
  {
    name: "6 Months Living Support",
    total: 12000,
    saved: 0,
    used: 0,
    available: 0,
  },
  {
    name: "Dentist Checkup",
    total: 100,
    saved: 100,
    used: 0,
    available: 100,
  },
  {
    name: "Business & Real Estate",
    total: "Unlimited",
    saved: 180,
    used: 80.5,
    available: 99.5,
  },
  { name: "Gold", total: "Unlimited", saved: 0, used: 0, available: 0 },
  { name: "Mortgage Deposit", total: 50000, saved: 0, used: 0, available: 0 },
  {
    name: "Relocation",
    total: 3000,
    saved: 3000,
    used: 123.26,
    available: 2876.74,
  },
  {
    name: "Tattoo Removal",
    total: 220,
    saved: 220,
    used: 0,
    available: 220,
  },
  {
    name: "Car",
    total: 15000,
    saved: 9684.95,
    used: 0,
    available: 9684.95,
  },
];

// Yearly expenses -----------------------------------------------------------
export type YearlyExpenses = {
  name: string;
  total: number;
  totalShouldBe: string;
  monthlySaving: number;
  saved: number;
  missed: number;
  used: number;
  available: number;
};

export const yearlyExpenses: YearlyExpenses[] = [
  {
    name: "Summer Holiday (August)",
    total: 500,
    totalShouldBe: "500 - 1200",
    monthlySaving: 41.67,
    saved: 1200,
    missed: 0,
    used: 427,
    available: 773,
  },
  {
    name: "Winter Holiday (January)",
    total: 0,
    totalShouldBe: "500 - 1200",
    monthlySaving: 0,
    saved: 0,
    missed: 0,
    used: 0,
    available: 0,
  },
  {
    name: "Phone (August)",
    total: 2200,
    totalShouldBe: "2200.00",
    monthlySaving: 45.83,
    saved: 0,
    missed: 0,
    used: 0,
    available: 0,
  },
  {
    name: "Laptop (August)",
    total: 5000,
    totalShouldBe: "5000.00",
    monthlySaving: 104.17,
    saved: 0,
    missed: 0,
    used: 0,
    available: 0,
  },
  {
    name: "Perfumes (August)",
    total: 250,
    totalShouldBe: "250 - 500",
    monthlySaving: 20.83,
    saved: 0,
    missed: 0,
    used: 0,
    available: 0,
  },
];

// Monthly budget -----------------------------------------------------------
export const monthlyBudget = {
  income: [{ name: "Hydrogenera", amount: 3000 }],
  essentials: {
    monthly: [
      {
        id: "nextMonth",
        items: [{ name: "Next Month Savings", amount: 465.83 }],
      },
      {
        id: "expenses",
        items: [
          { name: "One Drive", amount: 7.1 },
          { name: "iCloud", amount: 2.35 },
          { name: "Barber", amount: 25 },
          { name: "Meds", amount: 10 },
          { name: "Toiletries", amount: 0 },
          { name: "Transport", amount: 80 },
          { name: "Phone", amount: 0 },
          { name: "Sports", amount: 40 },
          { name: "Internet", amount: 0 },
          { name: "Bills", amount: 0 },
          { name: "Rent", amount: 0 },
        ],
      },
      {
        id: "savings",
        items: [
          { name: "Apparel Saving", amount: 0 },
          { name: "Eset Antivirus Savings", amount: 0 },
        ],
      },
    ],
    weekly: [{ name: "Food", amount: 100 }],
  },
  luxury: {
    monthly: [
      {
        id: "expenses",
        items: [
          { name: "Little Things", amount: 10 },
          { name: "Massage", amount: 0 },
          { name: "Activities", amount: 0 },
          { name: "Birthday Present", amount: 50 },
          { name: "Going Out", amount: 80 },
        ],
      },
      {
        id: "savings",
        items: [
          { name: "Fixed Expenses Savings (20%+)", amount: 6324.34 },
          { name: "Mortgage Deposit Fixed Expenses Savings (10%)", amount: 0 },
          { name: "Summer Holiday Savings", amount: 0 },
          { name: "Winter Holiday Savings", amount: 0 },
          { name: "Travelling Savings", amount: 0 },
          { name: "Phone Savings", amount: 0 },
          { name: "Laptop Savings", amount: 0 },
          { name: "Concerts Savings", amount: 0 },
          { name: "Birthday Party Savings", amount: 0 },
          { name: "Perfumes Savings", amount: 0 },
          { name: "Spotify Savings", amount: 2.67 },
          { name: "Car Insurance Savings", amount: 0 },
          { name: "Car Tax Savings", amount: 0 },
          { name: "Car MOT Savings", amount: 0 },
          { name: "Renovations Savings", amount: 0 },
        ],
      },
    ],
    weekly: [
      { name: "Dating", amount: 30 },
      { name: "Going Out", amount: 20 },
      { name: "Eat Out", amount: 10 },
    ],
  },
  investments: {
    monthly: [
      { name: "S&P500 (45%)", amount: 63 },
      { name: "Business & Real Estate Savings (45%)", amount: 62.99 },
      { name: "Gold Savings (10%)", amount: 14 },
    ],
  },
};

// Months list --------------------------------------------------------------
export const months = [
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
] as const;
