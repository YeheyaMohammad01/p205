"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat-message";
import { SuggestedQuestions } from "@/components/suggested-questions";
import { Send, Sparkles } from "lucide-react";
import { Bot } from "lucide-react";
import { useFinancial } from "@/contexts/financial-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI financial assistant. I can help you understand your spending patterns, identify savings opportunities, and answer questions about your finances. What would you like to know?",
  },
];

const mockResponses: Record<string, string> = {
  "where did i overspend this month?":
    "Based on your transactions, you overspent in the Food & Dining category by $150 compared to last month. Your spending at restaurants increased by 35%, particularly at Whole Foods Market and Starbucks.",
  "what's my biggest expense category?":
    "Your biggest expense category this month is Bills & Utilities at $1,200, which represents 35% of your total spending. This is followed by Shopping at $680 and Food & Dining at $850.",
  "how can i save more money?":
    "I've identified three key opportunities: 1) Reduce dining out by cooking at home more often (potential savings: $200/month), 2) Review subscription services - you have Netflix and others that might be redundant (savings: $30/month), 3) Consider carpooling or public transit to reduce transportation costs (savings: $100/month).",
  "show me unusual transactions":
    "I found 2 unusual transactions: 1) A $124.99 Amazon purchase on Jun 14, which is 3x your average Amazon spending, and 2) An $87.43 Whole Foods purchase on Jun 15, which is higher than your typical grocery spending of $50-60.",
};

export default function InsightsPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data } = useFinancial();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          transactions: data.transactions,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.details || responseData.error || "Failed to get response"
        );
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responseData.message || "Sorry, I couldn't process that request.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorMsg}. Please check the console for details.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            AI Insights
          </h2>
          <p className="text-muted-foreground">
            Ask questions about your spending and get personalized insights
          </p>
        </div>

        <Card
          className="flex flex-col"
          style={{ height: "calc(100vh - 16rem)" }}
        >
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Financial Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-6">
                <SuggestedQuestions onSelectQuestion={handleSendMessage} />
              </div>
            )}

            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Ask about your finances
                </label>
                <Input
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="flex-1"
                  disabled={isTyping}
                  aria-label="Type your financial question"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
