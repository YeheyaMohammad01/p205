import { NextRequest, NextResponse } from "next/server"

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages, transactions } = await req.json()

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Return mock response if no API key
      return NextResponse.json({
        message: generateMockResponse(messages[messages.length - 1].content, transactions),
      })
    }

    const systemPrompt = `You are a helpful financial assistant analyzing transaction data. 
Here are the user's recent transactions:
${JSON.stringify(transactions, null, 2)}

Provide insights, answer questions, and give actionable advice based on this data. Keep responses concise and friendly.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", response.status, errorData)
      
      // If rate limited, fall back to mock response
      if (response.status === 429) {
        console.log("Rate limited - falling back to mock response")
        return NextResponse.json({
          message: generateMockResponse(messages[messages.length - 1].content, transactions),
        })
      }
      
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0].message.content

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to get response",
      details: errorMessage 
    }, { status: 500 })
  }
}

function generateMockResponse(userMessage: string, transactions: any[]): string {
  const msg = userMessage.toLowerCase()

  if (transactions.length === 0) {
    return "I don't see any transactions yet. Upload a CSV file with your transaction data, and I'll help you analyze your spending patterns!"
  }

  const totalSpent = transactions.reduce((sum, t) => sum + (t.type === "expense" ? t.amount : 0), 0)
  const categories = transactions.reduce(
    (acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = (acc[t.category] || 0) + t.amount
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categories).sort(
    ([, a], [, b]) => (b as number) - (a as number),
  )[0] as [string, number] | undefined

  if (msg.includes("spend") || msg.includes("spent")) {
    return `Based on your ${transactions.length} transactions, you've spent a total of $${totalSpent.toFixed(2)}. Your biggest spending category is ${topCategory?.[0] || "Other"} at $${topCategory?.[1]?.toFixed(2) || "0"}.`
  }

  if (msg.includes("save") || msg.includes("saving")) {
    return `To save money, I recommend: 1) Track your ${topCategory?.[0] || "spending"} more carefully - it's your largest expense at $${topCategory?.[1]?.toFixed(2) || "0"}. 2) Set a monthly budget and stick to it. 3) Look for recurring subscriptions you might not need.`
  }

  if (msg.includes("budget")) {
    return `With ${transactions.length} transactions totaling $${totalSpent.toFixed(2)}, a good monthly budget might be around $${Math.ceil(totalSpent * 1.1)}. This gives you a 10% buffer while keeping spending in check.`
  }

  if (msg.includes("category") || msg.includes("categories")) {
    const categoryList = Object.entries(categories)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: $${(amt as number).toFixed(2)}`)
      .join(", ")
    return `Your top spending categories are: ${categoryList}. Would you like tips on reducing spending in any of these areas?`
  }

  if (msg.includes("pattern") || msg.includes("trend") || msg.includes("habit")) {
    const avgTransaction = totalSpent / transactions.length
    return `Looking at your ${transactions.length} transactions, your average transaction is $${avgTransaction.toFixed(2)}. Your spending is concentrated in ${topCategory?.[0] || "various categories"} ($${topCategory?.[1]?.toFixed(2) || "0"}), which accounts for ${topCategory?.[1] ? ((topCategory[1] / totalSpent) * 100).toFixed(0) : "0"}% of your total spending.`
  }

  if (msg.includes("advice") || msg.includes("tip") || msg.includes("help") || msg.includes("recommend")) {
    const categoryCount = Object.keys(categories).length
    return `Here are some personalized tips: 1) You're spending across ${categoryCount} categories - consider consolidating to better track your money. 2) Your top expense is ${topCategory?.[0]} - look for alternatives or compare prices. 3) Set up alerts when you exceed your budget in any category.`
  }

  if (msg.includes("compare") || msg.includes("average") || msg.includes("normal")) {
    const dailyAvg = totalSpent / 30
    return `Your spending averages $${dailyAvg.toFixed(2)} per day, or about $${totalSpent.toFixed(2)} per month. The typical person spends $2,000-3,000/month on essentials. You're ${totalSpent > 3000 ? 'above' : 'below'} the average.`
  }

  return `I see you have ${transactions.length} transactions totaling $${totalSpent.toFixed(2)}. Your largest expense category is ${topCategory?.[0] || "Other"} at $${topCategory?.[1]?.toFixed(2) || "0"}. Try asking me about your spending patterns, savings tips, or budget recommendations!`
}
