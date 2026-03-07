import { useState, useEffect } from "react";
import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { request } from "@/services/api";
import { cn } from "@/lib/utils";
import type { TagOption } from "@/types/tag";

export const TagSelectorField = ({
  control,
  disabled = false,
}: {
  control: Control<any>;
  disabled?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<TagOption[]>([]);

  useEffect(() => {
    if (disabled || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchTags = async () => {
      try {
        const res = await request(`/tags?name=${searchTerm}`, "GET");
        setSuggestions(res);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    const debounce = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, disabled]);

  return (
    <FormField
      control={control}
      name="tagIds"
      render={({ field }) => {
        const currentTags: TagOption[] = Array.isArray(field.value)
          ? field.value
          : [];

        const handleRemove = (e: React.MouseEvent, idToRemove: string) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          const nextTags = currentTags.filter((tag) => tag._id !== idToRemove);
          field.onChange(nextTags);
        };

        return (
          <FormItem className="flex flex-col items-start">
            <FormLabel className="label-required">Tags (Categories)</FormLabel>
            
            <div 
              className={cn(
                "w-full border rounded-lg p-2 transition-all",
                disabled 
                  ? "bg-header-bg border-slate-200 cursor-not-allowed opacity-80" 
                  : "bg-header-bg border-slate-200 focus-within:ring-2 ring-blue-500"
              )}
            >
              <div className="flex flex-wrap gap-2 mb-2 overflow-auto">
                {currentTags.map((tag) => (
                  <Badge
                    key={tag.id || tag._id}
                    variant="secondary"
                    className={cn(
                      "bg-blue-100 text-blue-700 flex items-center gap-1 ",
                      disabled && "cursor-not-allowed"
                    )}
                  >
                    {tag.name}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, tag._id)}
                        className="hover:text-red-500 transition-colors hover:scale-125"
                      >
                        <X className="w-3 h-3 cursor-pointer" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              <FormControl>
                <input
                  className={cn(
                    "bg-transparent border-none outline-none w-full p-1 text-sm",
                    disabled ? "cursor-not-allowed placeholder:text-slate-400" : "cursor-pointer"
                  )}
                  placeholder={disabled ? "" : "Search tags..."}
                  value={searchTerm}
                  disabled={disabled}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              </FormControl>
            </div>

            {!disabled && suggestions.length > 0 && (
              <div className="relative w-full">
                <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-48 overflow-auto">
                  {suggestions.map((tag) => (
                    <li
                      key={tag.id}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      onClick={() => {
                        if (!currentTags.some((t) => t.id === tag.id)) {
                          field.onChange([...currentTags, tag]);
                        }
                        setSearchTerm("");
                        setSuggestions([]);
                      }}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};