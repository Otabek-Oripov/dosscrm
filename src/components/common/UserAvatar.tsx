import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

interface Props {
  name?: string
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ name, size = "sm", className }: Props) {
  const sizeClass =
    size === "xs"
      ? "size-5 text-[9px]"
      : size === "sm"
      ? "size-7 text-[10px]"
      : size === "md"
      ? "size-8 text-[11px]"
      : "size-10 text-[12px]"
  return (
    <Avatar className={cn(sizeClass, className)}>
      <AvatarFallback className={sizeClass}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
}
