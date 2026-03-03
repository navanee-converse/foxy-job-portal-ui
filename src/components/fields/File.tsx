import { type Control, Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, FileText, ExternalLink } from "lucide-react";

interface FileFieldProps {
  control: Control<any>;
  existingUrl?: string | null;
  onRemoveExisting: () => void;
  isSyncing?: boolean;
}

export const FileField = ({
  control,
  existingUrl,
  onRemoveExisting,
  isSyncing,
}: FileFieldProps) => (
  <div className="space-y-4">
    <Controller
      control={control}
      name="resume"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className="w-full">
          <FormLabel>Resume</FormLabel>
          <FormControl>
            {isSyncing ? (
              <div className="flex items-center gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-blue-700">
                  Processing your resume...
                </span>
              </div>
            ) : existingUrl && !value ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium text-slate-700 truncate max-w-50">
                    Current Resume
                  </span>
                  <a
                    href={
                      existingUrl.endsWith(".pdf")
                        ? existingUrl
                        : `https://docs.google.com/gview?url=${encodeURIComponent(existingUrl)}&embedded=true`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveExisting}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                  className="h-12 bg-slate-50 file:mt-0 pt-2 border-slate-200 focus:bg-white"
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
