import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import { request } from "@/services/api";

export const useSearchSuggestions = <T>(
  endpoint: string,
  mapFn: (item: T) => string,
  minLength = 1,
) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 500);

  const containerRef = useRef<HTMLDivElement>(null);
  const isNavigating = useRef(false);
  const prevValue = useRef("");

  const mapFnRef = useRef(mapFn);
  useEffect(() => {
    mapFnRef.current = mapFn;
  }, [mapFn]);

  useEffect(() => {
    const wasNavigating = isNavigating.current;
    if (wasNavigating) {
      isNavigating.current = false;
      return;
    }

    const fetchSuggestions = async () => {
      if (debouncedValue.length >= minLength) {
        try {
          const res = await request<{ data: T[] }>(
            `${endpoint}${encodeURIComponent(debouncedValue)}`,
            "GET",
          );

          const rawData = res.data || [];

          const results = rawData.map((item) => {
            try {
              return mapFnRef.current(item);
            } catch (e) {
              return String(item);
            }
          });

          const filteredResults = Array.from(new Set(results.filter(Boolean)));

          setSuggestions(filteredResults);
          setShowSuggestions(filteredResults.length > 0);
          setSelectedIndex(-1);
        } catch (err) {
          console.error("Suggestions error:", err);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, endpoint, minLength]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      isNavigating.current = true;

      const isDown = e.key === "ArrowDown";
      const next = isDown
        ? selectedIndex === suggestions.length - 1
          ? -1
          : selectedIndex + 1
        : selectedIndex === -1
          ? suggestions.length - 1
          : selectedIndex - 1;

      setSelectedIndex(next);
      const newValue = next === -1 ? prevValue.current : suggestions[next];
      setValue(newValue);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selection = suggestions[selectedIndex];
      setValue(selection);
      prevValue.current = selection;
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setValue(prevValue.current);
      setShowSuggestions(false);
    }
  };

  return {
    value,
    setValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    containerRef,
    prevValue,
  };
};
