import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useEffect } from "react";

interface Props {
  control: Control<any>;
  name: string;
  title: string;
  placeholder: string;
}

export const DynamicListSection = ({
  control,
  name,
  title,
  placeholder,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={placeholder}
                      className="bg-slate-50 focus:bg-white h-12"
                    />
                  </FormControl>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </section>
  );
};
