export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: "expense" | "income"
}

export interface BudgetCategory {
  name: string
  allocated: number
  spent: number
}

export interface FinancialData {
  transactions: Transaction[]
  budgetCategories: BudgetCategory[]
  monthlyBudget: number
}
