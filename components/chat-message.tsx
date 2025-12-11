import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-sm leading-relaxed mb-2 last:mb-0">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="text-sm leading-relaxed list-disc list-inside space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="text-sm leading-relaxed list-decimal list-inside space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="text-sm">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code
                className={cn(
                  "px-1.5 py-0.5 rounded text-xs font-mono",
                  isUser ? "bg-primary-foreground/20" : "bg-background/20"
                )}
              >
                {children}
              </code>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="underline hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
