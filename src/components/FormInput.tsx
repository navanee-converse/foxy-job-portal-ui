import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Control } from "react-hook-form";

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled: boolean;
  control: Control<any>;
  className?: string;
}

export const FormInput = ({
  name,
  label,
  placeholder,
  disabled,
  control,
  className,
}: FormInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("w-full", className)}>
        <FormLabel className="text-slate-700">{label}</FormLabel>
        <FormControl>
          <Input
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "bg-slate-50 border-slate-200 focus:bg-white h-12",
              "disabled:cursor-not-allowed disabled:opacity-70 disabled:pointer-events-auto ",
              disabled && "select-none",
              className,
            )}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
