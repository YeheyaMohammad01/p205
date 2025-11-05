"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionRow } from "@/components/transaction-row"
import { Search, Filter } from "lucide-react"

interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
}

const initialTransactions: Transaction[] = [
  { id: "1", date: "Jun 15", merchant: "Whole Foods Market", category: "Food & Dining", amount: 87.43 },
  { id: "2", date: "Jun 14", merchant: "Shell Gas Station", category: "Transportation", amount: 52.0 },
  { id: "3", date: "Jun 14", merchant: "Amazon.com", category: "Shopping", amount: 124.99 },
  { id: "4", date: "Jun 13", merchant: "Netflix", category: "Entertainment", amount: 15.99 },
  { id: "5", date: "Jun 12", merchant: "Electric Company", category: "Bills & Utilities", amount: 145.67 },
  { id: "6", date: "Jun 11", merchant: "Starbucks", category: "Food & Dining", amount: 6.75 },
  { id: "7", date: "Jun 10", merchant: "Uber", category: "Transportation", amount: 23.5 },
  { id: "8", date: "Jun 9", merchant: "Target", category: "Shopping", amount: 89.32 },
  { id: "9", date: "Jun 8", merchant: "CVS Pharmacy", category: "Healthcare", amount: 34.21 },
  { id: "10", date: "Jun 7", merchant: "Chipotle", category: "Food & Dining", amount: 12.85 },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const handleUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Transactions</h2>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} onUpdate={handleUpdateTransaction} />
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No transactions found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
