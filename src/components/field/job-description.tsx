import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const JobDescriptionField = <T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) => {
  return (
    <section className="space-y-6">
      <FormField
        control={control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xl font-bold text-slate-800 label-required">
              Job Description
            </FormLabel>
            <FormControl>
              <Textarea
                className="bg-header-bg min-h-50 cursor-pointer"
                placeholder="Explain the role in detail..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};
