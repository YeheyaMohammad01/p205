"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface BudgetCategoryProps {
  name: string
  limit: number
  spent: number
  onLimitChange: (value: number) => void
}

export function BudgetCategory({ name, limit, spent, onLimitChange }: BudgetCategoryProps) {
  const percentage = (spent / limit) * 100
  const remaining = limit - spent
  const isOverBudget = spent > limit

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Label className="text-base font-semibold">{name}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                ${spent.toFixed(2)} spent of ${limit.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-medium", isOverBudget ? "text-destructive" : "text-muted-foreground")}>
                {isOverBudget ? `$${Math.abs(remaining).toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
              </p>
            </div>
          </div>

          <Progress value={Math.min(percentage, 100)} className={cn("h-2", isOverBudget && "bg-destructive/20")} />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label htmlFor={`${name}-input`} className="text-sm text-muted-foreground whitespace-nowrap">
                Monthly Limit:
              </Label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id={`${name}-input`}
                  type="number"
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="pl-6"
                  min={0}
                  step={50}
                />
              </div>
            </div>

            <Slider
              value={[limit]}
              onValueChange={(values) => onLimitChange(values[0])}
              max={2000}
              step={50}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
