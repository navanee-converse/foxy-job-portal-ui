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

export interface Tag {
  id: string;
  name: string;
}

export const TagSelectorField = ({ control }: { control: Control<any> }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await request(`/tags?name=${searchTerm}`, "GET");
        setSuggestions(res);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    const debounce = setTimeout(fetchTags, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <FormField
      control={control}
      name="tagIds"
      render={({ field }) => {
        const currentTags: Tag[] = Array.isArray(field.value)
          ? field.value
          : [];

        const handleRemove = (e: React.MouseEvent, idToRemove: string) => {
          e.preventDefault();
          e.stopPropagation();
          const nextTags = currentTags.filter((tag) => tag.id !== idToRemove);
          field.onChange(nextTags);
        };

        return (
          <FormItem className="flex flex-col items-start">
            <FormLabel>Tags (Categories)</FormLabel>
            <div className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus-within:ring-2 ring-blue-500">
              <div className="flex flex-wrap gap-2 mb-2">
                {currentTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 flex items-center gap-1"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, tag.id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 cursor-pointer" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormControl>
                <input
                  className="bg-transparent border-none outline-none w-full p-1 text-sm"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              </FormControl>
            </div>

            {suggestions.length > 0 && (
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
