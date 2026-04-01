import { useState, useEffect } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { request } from "@/services/api";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/response";
import type { Category } from "@/types/job";

interface CategorySelectorFieldProps<T extends FieldValues> {
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
}

export const CategorySelectorField = <T extends FieldValues>({
  control,
  disabled = false,
  required = true,
}: CategorySelectorFieldProps<T>) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (disabled) return;
      setIsLoading(true);
      try {
        const res = await request<Category[]>("/categories", "GET");
        setCategories(res);
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          console.error(apiError.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [disabled]);

  return (
    <FormField
      control={control}
      name={"categoryId" as Path<T>}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className={cn(required && "label-required")}>
            Category
          </FormLabel>

          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled || isLoading}
          >
            <FormControl className="w-full h-12!">
              <SelectTrigger className="bg-header-bg h-12 border border-slate-200">
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select a category"}
                />
              </SelectTrigger>
            </FormControl>

            <SelectContent className="bg-white border border-blue-600 shadow-xl">
              {categories.length === 0 && !isLoading ? (
                <div className="p-4 text-sm text-center text-slate-500">
                  No categories found.
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem
                    key={cat._id}
                    value={cat._id}
                    className="cursor-pointer hover:bg-slate-50 focus:bg-brand-light focus:text-brand-primary py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  );
};
