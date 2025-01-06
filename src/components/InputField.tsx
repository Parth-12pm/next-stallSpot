import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}

export function InputField({ label, type, name, placeholder }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}