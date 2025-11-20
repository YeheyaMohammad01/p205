"use client"

import type { FinancialData, Transaction, BudgetCategory } from "./types"

const STORAGE_KEY = "pennywise_data"

const defaultData: FinancialData = {
  transactions: [],
  budgetCategories: [
    { name: "Bills & Utilities", allocated: 1200, spent: 0 },
    { name: "Food & Dining", allocated: 600, spent: 0 },
    { name: "Shopping", allocated: 400, spent: 0 },
    { name: "Transportation", allocated: 300, spent: 0 },
    { name: "Entertainment", allocated: 200, spent: 0 },
    { name: "Healthcare", allocated: 150, spent: 0 },
    { name: "Other", allocated: 150, spent: 0 },
  ],
  monthlyBudget: 3000,
}

export const storage = {
  getData(): FinancialData {
    if (typeof window === "undefined") return defaultData

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return defaultData
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error reading from storage:", error)
      return defaultData
    }
  },

  saveData(data: FinancialData): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to storage:", error)
    }
  },

  addTransactions(transactions: Transaction[]): void {
    const data = this.getData()
    data.transactions = [...data.transactions, ...transactions]
    
    // Update spent amounts in budget categories
    data.budgetCategories = data.budgetCategories.map((cat) => {
      const categorySpent = data.transactions
        .filter((t) => t.category === cat.name && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
      return { ...cat, spent: categorySpent }
    })
    
    this.saveData(data)
  },

  clearData(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },

  updateBudget(monthlyBudget: number, categories: BudgetCategory[]): void {
    const data = this.getData()
    data.monthlyBudget = monthlyBudget
    data.budgetCategories = categories
    this.saveData(data)
  },
}
