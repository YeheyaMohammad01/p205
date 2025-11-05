"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetCategory } from "@/components/budget-category"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"

interface CategoryBudget {
  name: string
  limit: number
  spent: number
}

const initialBudgets: CategoryBudget[] = [
  { name: "Food & Dining", limit: 800, spent: 850 },
  { name: "Transportation", limit: 400, spent: 420 },
  { name: "Shopping", limit: 600, spent: 680 },
  { name: "Bills & Utilities", limit: 1200, spent: 1200 },
  { name: "Entertainment", limit: 300, spent: 320 },
  { name: "Healthcare", limit: 200, spent: 34 },
]

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<CategoryBudget[]>(initialBudgets)
  const [hasChanges, setHasChanges] = useState(false)

  const handleLimitChange = (index: number, newLimit: number) => {
    setBudgets((prev) => prev.map((budget, i) => (i === index ? { ...budget, limit: newLimit } : budget)))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In a real app, this would save to a backend
    setHasChanges(false)
    // Show success message
  }

  const handleReset = () => {
    setBudgets(initialBudgets)
    setHasChanges(false)
  }

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalLimit - totalSpent

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance">Budget Simulator</h2>
            <p className="text-muted-foreground">Set monthly spending limits for each category</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-3xl">${totalLimit.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-3xl">${totalSpent.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Remaining</CardDescription>
              <CardTitle className={`text-3xl ${totalRemaining < 0 ? "text-destructive" : ""}`}>
                ${totalRemaining.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {budgets.map((budget, index) => (
            <BudgetCategory
              key={budget.name}
              name={budget.name}
              limit={budget.limit}
              spent={budget.spent}
              onLimitChange={(value) => handleLimitChange(index, value)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
