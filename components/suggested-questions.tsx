"use client"

import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

const questions = [
  "Where did I overspend this month?",
  "What's my biggest expense category?",
  "How can I save more money?",
  "Show me unusual transactions",
]

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">Suggested questions:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {questions.map((question) => (
          <Button
            key={question}
            variant="outline"
            className="h-auto justify-start whitespace-normal px-4 py-3 text-left text-sm bg-transparent"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
