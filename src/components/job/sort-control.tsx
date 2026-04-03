import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  sort: string;
  limit: number;
  onSortChange: (val: string) => void;
  onLimitChange: (val: number) => void;
  onClear: () => void;
  showClear: boolean;
}

const JobSortControls: React.FC<Props> = ({
  sort,
  limit,
  onSortChange,
  onLimitChange,
  onClear,
  showClear,
}) => {
  return (
    <div className="flex items-center justify-end p-4 bg-header-bg border-b border-gray-100 flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-40 h-9 bg-white rounded-lg border-gray-200 font-medium text-sm focus:ring-blue-500/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="font-medium">
              <SelectItem value="default">Sort by (default)</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={limit.toString()}
            onValueChange={(val) => onLimitChange(Number(val))}
          >
            <SelectTrigger className="w-30 h-9 rounded-lg border-gray-200 font-medium text-sm focus:ring-blue-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 Items</SelectItem>
              <SelectItem value="20">20 Items</SelectItem>
              <SelectItem value="30">30 Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-sm text-red-500 font-bold px-4 py-1.5 rounded-full cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
          Clear All
        </button>
      )}
    </div>
  );
};

export default JobSortControls;
