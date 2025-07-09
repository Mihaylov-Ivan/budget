"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Calendar, Target, PiggyBank } from "lucide-react"

export default function BudgetingApp() {
  const [currentMonth, setCurrentMonth] = useState("July")

  // Sample data based on your Excel screenshots
  const yearlyDistribution = {
    receivedIncome: 7870.45,
    shouldHave: 16471.97,
    actuallyHave: 16471.97,
    extra: 0.0,
  }

  const fixedSavings = [
    { name: "Emergency", total: 1000, saved: 0, used: 0, available: 0 },
    { name: "6 Months Living Support", total: 12000, saved: 0, used: 0, available: 0 },
    { name: "Dentist Checkup", total: 100, saved: 100, used: 0, available: 100 },
    { name: "Business & Real Estate", total: "Unlimited", saved: 180, used: 80.5, available: 99.5 },
    { name: "Gold", total: "Unlimited", saved: 0, used: 0, available: 0 },
    { name: "Mortgage Deposit", total: 50000, saved: 0, used: 0, available: 0 },
    { name: "Relocation", total: 3000, saved: 3000, used: 123.26, available: 2876.74 },
    { name: "Tattoo Removal", total: 220, saved: 220, used: 0, available: 220 },
    { name: "Car", total: 15000, saved: 9684.95, used: 0, available: 9684.95 },
  ]

  const yearlyExpenses = [
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
  ]

  const monthlyBudget = {
    income: [
      { name: "Hydrogenera", amount: 3000 },
      { name: "Student Loan", amount: 31.68 },
    ],
    essentials: {
      monthly: [
        { name: "One Drive", amount: 7.1 },
        { name: "iCloud", amount: 2.35 },
        { name: "Barber", amount: 45 },
        { name: "Meds", amount: 10 },
        { name: "Toiletries", amount: 10 },
        { name: "Transport", amount: 110 },
        { name: "Phone", amount: 28 },
        { name: "Sports", amount: 40 },
        { name: "Internet", amount: 20 },
        { name: "Banking Tax", amount: 1.99 },
        { name: "Bills", amount: 100 },
        { name: "Rent", amount: 700 },
      ],
      weekly: [{ name: "Food", amount: 100 }],
    },
    luxury: {
      monthly: [
        { name: "Little Things", amount: 10 },
        { name: "Activities", amount: 0 },
        { name: "Birthday Present", amount: 50 },
        { name: "Going Out", amount: 100 },
        { name: "Dating", amount: 30 },
      ],
      weekly: [
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
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Personal Budget Tracker</h1>
            <p className="text-gray-600">Manage your finances with precision and clarity</p>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="current-month">Current Month:</Label>
            <Select value={currentMonth} onValueChange={setCurrentMonth}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Yearly Money Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Yearly Money Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Received Income</div>
                <div className="text-2xl font-bold text-blue-900">${yearlyDistribution.receivedIncome.toFixed(2)}</div>
                <div className="text-xs text-blue-600">Total received income to date</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Should Have</div>
                <div className="text-2xl font-bold text-orange-900">${yearlyDistribution.shouldHave.toFixed(2)}</div>
                <div className="text-xs text-orange-600">Fixed savings + expense savings + current month budget</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Actually Have</div>
                <div className="text-2xl font-bold text-green-900">${yearlyDistribution.actuallyHave.toFixed(2)}</div>
                <div className="text-xs text-green-600">Cash + accounts + investments + debt</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Extra</div>
                <div className="text-2xl font-bold text-purple-900">${yearlyDistribution.extra.toFixed(2)}</div>
                <div className="text-xs text-purple-600">Difference between should have and actually have</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="fixed-savings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fixed-savings">Fixed Savings</TabsTrigger>
            <TabsTrigger value="yearly-expenses">Yearly Expenses</TabsTrigger>
            <TabsTrigger value="monthly-budget">Monthly Budget</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Fixed Savings Tab */}
          <TabsContent value="fixed-savings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Fixed Savings
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Saving Goal
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Saving</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Available to Use</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixedSavings.map((saving, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{saving.name}</TableCell>
                        <TableCell>
                          {typeof saving.total === "number" ? `$${saving.total.toFixed(2)}` : saving.total}
                        </TableCell>
                        <TableCell>${saving.saved.toFixed(2)}</TableCell>
                        <TableCell>${saving.used.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${saving.available.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yearly Expenses Tab */}
          <TabsContent value="yearly-expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Yearly Expense Savings
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Yearly Expense
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Total Should Be</TableHead>
                      <TableHead>Monthly Saving</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyExpenses.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>${expense.total.toFixed(2)}</TableCell>
                        <TableCell>{expense.totalShouldBe}</TableCell>
                        <TableCell>${expense.monthlySaving.toFixed(2)}</TableCell>
                        <TableCell>${expense.saved.toFixed(2)}</TableCell>
                        <TableCell>${expense.used.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${expense.available.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Budget Tab */}
          <TabsContent value="monthly-budget">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Income
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Income
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthlyBudget.income.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-green-700">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-200">
                      <span className="font-bold">Total Income</span>
                      <span className="font-bold text-green-800">
                        ${monthlyBudget.income.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Essentials */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Essentials
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Essential
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Monthly</h4>
                      <div className="space-y-2">
                        {monthlyBudget.essentials.monthly.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Weekly</h4>
                      <div className="space-y-2">
                        {monthlyBudget.essentials.weekly.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Luxury */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Luxury
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Luxury Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Monthly</h4>
                      <div className="space-y-2">
                        {monthlyBudget.luxury.monthly.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Weekly</h4>
                      <div className="space-y-2">
                        {monthlyBudget.luxury.weekly.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investments
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Investment
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {monthlyBudget.investments.monthly.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">{item.name}</span>
                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-200 mt-3">
                      <span className="font-bold text-sm">Total Investments</span>
                      <span className="font-bold text-green-800">
                        ${monthlyBudget.investments.monthly.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Fixed Savings</p>
                      <p className="text-2xl font-bold">$12,980.19</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                      <p className="text-2xl font-bold">$3,031.68</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                      <p className="text-2xl font-bold">$1,620.69</p>
                    </div>
                    <Target className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Investments</p>
                      <p className="text-2xl font-bold">$139.99</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
