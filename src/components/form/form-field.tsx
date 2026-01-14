import type React from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
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
}: FormFieldProps) {
  return (
    <div className="space-y-2">
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
