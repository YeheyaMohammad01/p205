"use client"

import type { Transaction } from "./types"

export async function parseCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        
        if (lines.length < 2) {
          reject(new Error("CSV file is empty or invalid"))
          return
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
        const transactions: Transaction[] = []

        // Find column indexes
        const dateIdx = headers.findIndex((h) => h.includes("date"))
        const descIdx = headers.findIndex((h) => h.includes("description") || h.includes("merchant") || h.includes("name"))
        const amountIdx = headers.findIndex((h) => h.includes("amount") || h.includes("price") || h.includes("total"))
        const categoryIdx = headers.findIndex((h) => h.includes("category"))

        if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
          reject(new Error("CSV must have date, description, and amount columns"))
          return
        }

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
          
          if (values.length < 3) continue

          const amount = Math.abs(parseFloat(values[amountIdx].replace(/[^0-9.-]/g, "")))
          if (isNaN(amount)) continue

          const transaction: Transaction = {
            id: `${Date.now()}_${i}`,
            date: values[dateIdx] || new Date().toISOString().split("T")[0],
            description: values[descIdx] || "Unknown",
            amount,
            category: categoryIdx !== -1 ? values[categoryIdx] : categorizeTransaction(values[descIdx]),
            type: "expense",
          }

          transactions.push(transaction)
        }

        resolve(transactions)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

function categorizeTransaction(description: string): string {
  const desc = description.toLowerCase()
  
  if (desc.includes("grocery") || desc.includes("supermarket") || desc.includes("whole foods") || desc.includes("trader joe")) {
    return "Food & Dining"
  }
  if (desc.includes("restaurant") || desc.includes("cafe") || desc.includes("starbucks") || desc.includes("coffee")) {
    return "Food & Dining"
  }
  if (desc.includes("gas") || desc.includes("fuel") || desc.includes("uber") || desc.includes("lyft")) {
    return "Transportation"
  }
  if (desc.includes("electric") || desc.includes("water") || desc.includes("internet") || desc.includes("phone")) {
    return "Bills & Utilities"
  }
  if (desc.includes("amazon") || desc.includes("target") || desc.includes("walmart")) {
    return "Shopping"
  }
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("movie") || desc.includes("theater")) {
    return "Entertainment"
  }
  if (desc.includes("doctor") || desc.includes("hospital") || desc.includes("pharmacy") || desc.includes("medical")) {
    return "Healthcare"
  }
  
  return "Other"
}
