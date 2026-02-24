import type { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const JobDescriptionField = ({ control }: { control: Control<any> }) => {
  return (
    <section className="space-y-6">
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xl font-bold text-slate-800">Job Description</FormLabel>
            <FormControl>
              <Textarea className="bg-slate-50 min-h-50" placeholder="Explain the role in detail..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};