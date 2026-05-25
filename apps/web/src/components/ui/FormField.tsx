import { Label } from "@/components/ui/Label";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  error,
  required,
  children,
  className = "flex flex-col gap-1.5",
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
