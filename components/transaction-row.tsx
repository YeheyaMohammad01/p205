"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Check, X } from "lucide-react"

interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
}

interface TransactionRowProps {
  transaction: Transaction
  onUpdate: (id: string, updates: Partial<Transaction>) => void
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Healthcare",
  "Travel",
  "Other",
]

export function TransactionRow({ transaction, onUpdate }: TransactionRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMerchant, setEditedMerchant] = useState(transaction.merchant)
  const [editedCategory, setEditedCategory] = useState(transaction.category)

  const handleSave = () => {
    onUpdate(transaction.id, {
      merchant: editedMerchant,
      category: editedCategory,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedMerchant(transaction.merchant)
    setEditedCategory(transaction.category)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-0">
      <div className="w-24 shrink-0 text-sm text-muted-foreground">{transaction.date}</div>

      {isEditing ? (
        <>
          <Input
            value={editedMerchant}
            onChange={(e) => setEditedMerchant(e.target.value)}
            className="flex-1"
            placeholder="Merchant name"
          />
          <Select value={editedCategory} onValueChange={setEditedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <div className="flex-1 font-medium">{transaction.merchant}</div>
          <div className="w-40">
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {transaction.category}
            </span>
          </div>
        </>
      )}

      <div className="w-24 text-right font-semibold">${transaction.amount.toFixed(2)}</div>

      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
