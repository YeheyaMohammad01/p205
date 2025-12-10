import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet } from "lucide-react"

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">PennyWise</h1>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User profile avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
