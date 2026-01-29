import type React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: any;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required = false,
  htmlFor,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Label htmlFor={htmlFor}>
        {label} {required && "*"}
      </Label>

      {children}

      {error && "message" in error && typeof error.message === "string" && (
        <p className="text-destructive text-sm">{error.message}</p>
      )}
    </div>
  );
}
