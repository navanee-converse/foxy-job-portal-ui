import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, FileText, ExternalLink } from "lucide-react";

interface FileFieldProps<T extends FieldValues> {
  control: Control<T>;
  existingUrl?: string | null;
  onRemoveExisting: () => void;
  isSyncing?: boolean;
}
const documentViewUrl = import.meta.env.VITE_DOC_VIEW_URL;

export const FileField = <T extends FieldValues>({
  control,
  existingUrl,
  onRemoveExisting,
  isSyncing,
}: FileFieldProps<T>) => (
  <div className="space-y-4">
    <Controller
      control={control}
      name={"resume" as Path<T>}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className="w-full">
          <FormLabel>Resume</FormLabel>
          <FormControl>
            {isSyncing ? (
              <div className="flex items-center gap-3 p-3 border border-blue-200 bg-header-bg rounded-lg animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-blue-700">
                  Processing your resume...
                </span>
              </div>
            ) : existingUrl && !value ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-header-bg border-slate-200 gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <FileText className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate max-w-37.5 xs:max-w-[200px] sm:max-w-50">
                    Current Resume
                  </span>
                  <a
                    href={
                      existingUrl.endsWith(".pdf")
                        ? existingUrl
                        : `${documentViewUrl}${encodeURIComponent(existingUrl)}&embedded=true`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveExisting}
                  className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-header-bg h-auto p-0 sm:p-2 self-end sm:self-auto"
                >
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(file);
                  }}
                  className="h-12 bg-header-bg file:mt-0 pt-2 border-slate-200 focus:bg-white"
                  {...field}
                />
                {value && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    New file selected: {(value as File).name}
                  </p>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
