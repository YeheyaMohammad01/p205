"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionRow } from "@/components/transaction-row";
import { Search, Filter } from "lucide-react";
import { useFinancial } from "@/contexts/financial-context";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const { data } = useFinancial();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleUpdateTransaction = (
    id: string,
    updates: Partial<{ merchant: string; category: string; amount: number }>
  ) => {
    // For now, just log - in a real app you'd update storage
    console.log("Update transaction:", id, updates);
  };

  const filteredTransactions = useMemo(() => {
    return data.transactions
      .filter((t) => {
        const matchesSearch = t.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.transactions, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(data.transactions.map((t) => t.category)));
  }, [data.transactions]);

  // Convert Transaction to format expected by TransactionRow
  const formattedTransactions = filteredTransactions.map((t) => ({
    id: t.id,
    date: new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    merchant: t.description,
    category: t.category,
    amount: t.amount,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Transactions
          </h2>
          <p className="text-muted-foreground">
            View and manage your transaction history
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <div className="relative flex-1">
                <label htmlFor="search-input" className="sr-only">
                  Search transactions
                </label>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="search-input"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search transactions by merchant name"
                />
              </div>
              <div>
                <label htmlFor="category-filter" className="sr-only">
                  Filter by category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48" id="category-filter">
                    <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {formattedTransactions.length > 0 ? (
                formattedTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onUpdate={handleUpdateTransaction}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  {data.transactions.length === 0
                    ? "No transactions yet. Upload a CSV file to get started!"
                    : "No transactions found matching your criteria"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
