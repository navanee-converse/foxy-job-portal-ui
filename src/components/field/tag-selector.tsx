import { useState, useEffect, useRef } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxValue,
  ComboboxItem,
} from "@/components/ui/combobox";
import { request } from "@/services/api";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/response";
import useDebounce from "@/hooks/useDebounce";

export type TagOption = {
  _id: string;
  name: string;
};

interface TagSelectorFieldProps<T extends FieldValues> {
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
}

export const TagSelectorField = <T extends FieldValues>({
  control,
  disabled = false,
  required = true,
}: TagSelectorFieldProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<TagOption[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm);

  const fetchTags = async (query?: string) => {
    if (disabled) return;
    try {
      const res = await request<TagOption[]>(
        `/tags${query ? `?name=${query}` : ""}`,
        "GET",
      );
      setSuggestions(res);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        console.error(apiError.message);
      }
    }
  };

  useEffect(() => {
    fetchTags(debouncedSearchTerm.trim() || undefined);
  }, [debouncedSearchTerm]);

  return (
    <FormField
      control={control}
      name={"tagIds" as Path<T>}
      render={({ field }) => {
        const value: TagOption[] = Array.isArray(field.value)
          ? field.value
          : [];

        return (
          <FormItem className="space-y-2 cursor-pointer">
            <FormLabel className={`${required ? "label-required" : "  "}`}>
              Tags (Categories)
            </FormLabel>

            <Combobox<TagOption, true>
              items={suggestions}
              multiple
              value={value}
              disabled={disabled}
              itemToStringValue={(item) => item.name}
              onValueChange={(val: TagOption[]) => {
                const unique = val.filter(
                  (v, i, arr) => arr.findIndex((x) => x._id === v._id) === i,
                );
                field.onChange(unique);
                setSearchTerm("");
              }}
            >
              <ComboboxChips className="border grid border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 transition-all duration-300">
                <div className="flex gap-2">
                  <ComboboxValue>
                    {value.map((tag) => (
                      <ComboboxChip
                        className="focus-within:bg-white"
                        key={tag._id}
                      >
                        {tag.name}
                      </ComboboxChip>
                    ))}
                  </ComboboxValue>
                </div>

                <ComboboxChipsInput
                  ref={inputRef}
                  placeholder="Search tags..."
                  value={searchTerm}
                  onFocus={() => fetchTags(undefined)}
                  className="cursor-pointer"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </ComboboxChips>

              <ComboboxContent
                className={cn(
                  "border border-blue-600",
                  "w-(--anchor-width) min-w-full",
                )}
              >
                {suggestions.length <= 0 && (
                  <ComboboxEmpty className="flex items-center justify-center font-medium text-sm h-30">
                    No tags found.
                  </ComboboxEmpty>
                )}

                <ComboboxList>
                  {suggestions.map((tag) => (
                    <ComboboxItem
                      className="cursor-pointer"
                      key={tag._id}
                      value={tag}
                    >
                      {tag.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FormMessage className="text-[11px]" />
          </FormItem>
        );
      }}
    />
  );
};
