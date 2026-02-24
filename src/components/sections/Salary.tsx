import type { Control } from "react-hook-form";
import { FormInput } from "../FormInput";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SalarySection = ({
  control,
  showFrequency = false,
}: {
  control: Control<any>;
  showFrequency?: boolean;
}) => {
  return (
    <section className="space-y-6">
      {!showFrequency && (
        <h2 className="text-xl font-bold text-slate-800">Salary Range</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FormInput
          name="minSalary"
          label="Min Salary"
          placeholder="Minimum salary"
          control={control}
          disabled={false}
        />
        {!showFrequency && (
          <FormInput
            name="maxSalary"
            label="Maximum salary"
            placeholder="Maximum salary"
            control={control}
            disabled={false}
          />
        )}
        {showFrequency && (
          <FormField
            control={control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12! bg-slate-50 capitalize w-full border-gray-200">
                      <SelectValue placeholder="Select frequency" />
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
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
        )}
      </div>
    </section>
  );
};
