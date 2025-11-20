"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { SpendingChart } from "@/components/spending-chart";
import { CategoryChart } from "@/components/category-chart";
import { DollarSign, TrendingDown, TrendingUp, CreditCard } from "lucide-react";
import { useFinancial } from "@/contexts/financial-context";
import { useMemo } from "react";

export default function HomePage() {
  const { data } = useFinancial();

  const stats = useMemo(() => {
    const expenses = data.transactions.filter((t) => t.type === "expense");
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const remaining = data.monthlyBudget - totalSpent;

    // Calculate top category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Calculate average daily spending
    const daysInMonth = 30;
    const avgDaily = totalSpent / daysInMonth;

    return {
      totalSpent,
      remaining,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      avgDaily,
    };
  }, [data]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Your financial overview at a glance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
            change={
              data.transactions.length === 0
                ? "No transactions yet"
                : `${data.transactions.length} transactions`
            }
            changeType={
              stats.totalSpent > data.monthlyBudget ? "negative" : "positive"
            }
            icon={DollarSign}
          />
          <StatCard
            title="Monthly Budget"
            value={`$${data.monthlyBudget.toFixed(2)}`}
            change={
              stats.remaining >= 0
                ? `$${stats.remaining.toFixed(2)} remaining`
                : `$${Math.abs(stats.remaining).toFixed(2)} over budget`
            }
            changeType={stats.remaining >= 0 ? "positive" : "negative"}
            icon={CreditCard}
          />
          <StatCard
            title="Top Category"
            value={stats.topCategory?.name || "N/A"}
            change={
              stats.topCategory
                ? `$${stats.topCategory.amount.toFixed(2)} this month`
                : "No data"
            }
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatCard
            title="Avg. Daily"
            value={`$${stats.avgDaily.toFixed(2)}`}
            change={
              data.transactions.length === 0
                ? "Upload transactions"
                : "Last 30 days"
            }
            changeType="positive"
            icon={TrendingDown}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingChart />
          <CategoryChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
