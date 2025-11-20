"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { FinancialData, Transaction, BudgetCategory } from "@/lib/types";
import { storage } from "@/lib/storage";

interface FinancialContextType {
  data: FinancialData;
  addTransactions: (transactions: Transaction[]) => void;
  updateBudget: (monthlyBudget: number, categories: BudgetCategory[]) => void;
  clearData: () => void;
  refreshData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(
  undefined
);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinancialData>(() => storage.getData());

  const refreshData = () => {
    setData(storage.getData());
  };

  const addTransactions = (transactions: Transaction[]) => {
    storage.addTransactions(transactions);
    refreshData();
  };

  const updateBudget = (
    monthlyBudget: number,
    categories: BudgetCategory[]
  ) => {
    storage.updateBudget(monthlyBudget, categories);
    refreshData();
  };

  const clearData = () => {
    storage.clearData();
    refreshData();
  };

  useEffect(() => {
    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <FinancialContext.Provider
      value={{ data, addTransactions, updateBudget, clearData, refreshData }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial must be used within FinancialProvider");
  }
  return context;
}
