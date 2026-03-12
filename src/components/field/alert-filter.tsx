import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AlertFormValues } from "@/validations/alert";
import type { Control } from "react-hook-form";

export const AlertFilterFields = ({ control }: { control: Control<AlertFormValues> }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField
      control={control}
      name="minSalary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Minimum Salary</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Minimum Salary"
              className="bg-header-bg cursor-pointer border-slate-200 focus:bg-white h-12"
              {...field}
              value={
                field.value === 0 || field.value === undefined
                  ? ""
                  : field.value
              }
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? undefined : Number(val));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="frequency"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Frequency</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-12! w-full bg-header-bg border-slate-200">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
            </FormControl>
            <FormMessage />
            <SelectContent>
              {["daily", "weekly"].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  </div>
);
