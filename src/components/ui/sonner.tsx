import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      theme="light"
      toastOptions={{
        classNames: {
          toast: "!bg-white !text-[var(--color-foreground)] !border !border-[var(--color-border)] !rounded-[8px] !text-[13px]",
          title: "!text-[13px] !font-medium",
          description: "!text-[12px] !text-[var(--color-muted)]",
          actionButton: "!bg-[var(--color-accent)] !text-white !rounded-[4px]",
          cancelButton: "!bg-[var(--color-surface)] !text-[var(--color-foreground)] !rounded-[4px]",
          success: "!border-[var(--color-success-soft)]",
          error: "!border-[var(--color-danger-soft)]",
        },
      }}
      {...props}
    />
  )
}

export { toast } from "sonner"
