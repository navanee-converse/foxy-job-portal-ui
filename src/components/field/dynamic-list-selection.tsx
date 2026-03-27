import {
  useFieldArray,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useEffect } from "react";

type StringArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T] &
  string;

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: StringArrayKeys<T>;
  title: string;
  placeholder: string;
  disabled?: boolean;
}

export const DynamicListSection = <T extends FieldValues>({
  control,
  name,
  title,
  placeholder,
  disabled = false,
}: Props<T>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  useEffect(() => {
    if (!disabled && fields.length === 0) {
      append("" as unknown as FieldArray<T, ArrayPath<T>>);
    }
  }, [fields, append, disabled]);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 label-required">
          {title}
        </h2>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("" as unknown as FieldArray<T, ArrayPath<T>>)}
            className="text-blue-600 border-blue-200 hover:bg-brand-primary transition-colors duration-300 hover:text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`${name}.${index}` as Path<T>}
            render={({ field: inputField }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...inputField}
                      disabled={disabled}
                      placeholder={disabled ? "" : placeholder}
                      className={`h-12 transition-all ${
                        disabled
                          ? "bg-header-bg border-transparent cursor-not-allowed select-text disabled:cursor-not-allowed "
                          : "bg-header-bg border-slate-200 cursor-pointer focus:ring-2 ring-blue-500"
                      }`}
                    />
                  </FormControl>

                  {!disabled && fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500 hover:bg-white cursor-pointer"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        ))}
      </div>
    </section>
  );
};
