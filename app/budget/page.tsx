"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetCategory } from "@/components/budget-category";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { useFinancial } from "@/contexts/financial-context";
import { toast } from "sonner";

interface CategoryBudget {
  name: string;
  limit: number;
  spent: number;
}

export default function BudgetPage() {
  const { data, updateBudget } = useFinancial();
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize budgets from context
    setBudgets(
      data.budgetCategories.map((cat) => ({
        name: cat.name,
        limit: cat.allocated,
        spent: cat.spent,
      }))
    );
  }, [data.budgetCategories]);

  const handleLimitChange = (index: number, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((budget, i) =>
        i === index ? { ...budget, limit: newLimit } : budget
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const categories = budgets.map((b) => ({
      name: b.name,
      allocated: b.limit,
      spent: b.spent,
    }));
    updateBudget(totalLimit, categories);
    setHasChanges(false);
    toast.success("Budget saved successfully!");
  };

  const handleReset = () => {
    setBudgets(
      data.budgetCategories.map((cat) => ({
        name: cat.name,
        limit: cat.allocated,
        spent: cat.spent,
      }))
    );
    setHasChanges(false);
  };

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalLimit - totalSpent;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Budget Simulator
            </h2>
            <p className="text-muted-foreground">
              Set monthly spending limits for each category
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
            >
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
              <CardTitle className="text-3xl">
                ${totalLimit.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-3xl">
                ${totalSpent.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Remaining</CardDescription>
              <CardTitle
                className={`text-3xl ${
                  totalRemaining < 0 ? "text-destructive" : ""
                }`}
              >
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
  );
}
