import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { SpendingChart } from "@/components/spending-chart"
import { CategoryChart } from "@/components/category-chart"
import { DollarSign, TrendingDown, TrendingUp, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview at a glance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Spent"
            value="$3,470"
            change="+12% from last month"
            changeType="negative"
            icon={DollarSign}
          />
          <StatCard
            title="Monthly Budget"
            value="$4,000"
            change="$530 remaining"
            changeType="positive"
            icon={CreditCard}
          />
          <StatCard
            title="Top Category"
            value="Bills"
            change="$1,200 this month"
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatCard
            title="Avg. Daily"
            value="$112"
            change="-5% from last month"
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
  )
}
