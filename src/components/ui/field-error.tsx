import { cn } from "@/lib/utils"

type FieldErrorProps = {
  /** Wire this to the input's `aria-describedby` so screen readers announce it. */
  id?: string
  messages?: string[]
  className?: string
}

export function FieldError({ id, messages, className }: FieldErrorProps) {
  if (!messages?.length) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn("mt-1 text-xs text-destructive", className)}
    >
      {messages[0]}
    </p>
  )
}
