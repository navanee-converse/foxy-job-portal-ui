import { useState, useRef, useEffect, type ElementType } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface CustomSelectProps<T extends string> {
  value: T | "";
  onChange: (val: T | "") => void;
  options: T[] | readonly T[];
  placeholder: string;
  icon?: ElementType;
}

const CustomSelect = <T extends string>({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full px-4 py-3 border rounded-lg text-sm transition-all cursor-pointer bg-white 
          ${isOpen ? "border-blue-500 " : "border-gray-200 hover:border-gray-300"}`}
      >
        {Icon && (
          <Icon
            className={`mr-3 ${isOpen ? "text-blue-500" : "text-gray-400"}`}
          />
        )}
        <span
          className={`flex-1 ${!value ? "text-gray-400" : "text-gray-800"}`}
        >
          {value || placeholder}
        </span>
        <FiChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : "text-gray-400"}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1"
          >
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-400 text-xs font-medium uppercase tracking-wider"
            >
              Clear Selection
            </li>
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-4 py-1 rounded-md cursor-pointer transition-colors capitalize
                  ${value === opt ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-500"}`}
              >
                {opt.replace(/-/g, " ")}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
