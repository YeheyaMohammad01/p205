"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useFinancial } from "@/contexts/financial-context";
import { useMemo } from "react";

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
};

export function SpendingChart() {
  const { data } = useFinancial();

  const chartData = useMemo(() => {
    if (data.transactions.length === 0) {
      return [
        { month: "Jan", spending: 0 },
        { month: "Feb", spending: 0 },
        { month: "Mar", spending: 0 },
        { month: "Apr", spending: 0 },
        { month: "May", spending: 0 },
        { month: "Jun", spending: 0 },
      ];
    }

    // Group transactions by month
    const monthlyData = data.transactions.reduce((acc, t) => {
      if (t.type !== "expense") return acc;
      const date = new Date(t.date);
      const monthKey = date.toLocaleString("default", { month: "short" });
      acc[monthKey] = (acc[monthKey] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    // Get last 6 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      last6Months.push({
        month: monthName,
        spending: monthlyData[monthName] || 0,
      });
    }

    return last6Months;
  }, [data.transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Your spending over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="var(--color-spending)"
              strokeWidth={2}
              fill="url(#fillSpending)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
