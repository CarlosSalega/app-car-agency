import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnumOption<T extends string> {
  value: T;
  label: string;
}

interface EnumSelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly EnumOption<T>[];
  placeholder?: string;
  disabled?: boolean;
}

export function EnumSelect<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
}: EnumSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
