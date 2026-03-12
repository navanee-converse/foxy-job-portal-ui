import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormInput } from "../form-input";

export const RoleOverviewSection = <T extends FieldValues>({
  control,
  showLastDate = true,
  disabled = false,
}: {
  control: Control<T>;
  showLastDate?: boolean;
  disabled?: boolean;
}) => {
  const today = new Date().toISOString().split("T")[0];
  const gridCols = showLastDate ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section className="space-y-6">
      {showLastDate && (
        <h2 className="text-xl font-bold text-slate-800">Role Overview</h2>
      )}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-10 justify-items-stretch`}
      >
        {" "}
        <FormInput
          name={"title" as Path<T>}
          label="Job Title"
          placeholder="Job Title"
          control={control}
          disabled={false}
          required={true}
        />
        <FormField
          control={control}
          name={"location" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="h-12! cursor-pointer bg-header-bg capitalize w-full border-gray-200">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["onsite", "hybrid", "remote"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {showLastDate && (
          <FormField
            control={control}
            name={"lastDate" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Date to Apply </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={disabled}
                    className={`h-12 bg-header-bg ${disabled ? "cursor-not-allowed pointer-events-auto!" : "cursor-pointer pointer-events-auto!"}!`}
                    min={today}
                    value={
                      field.value &&
                      typeof field.value === "object" &&
                      "toISOString" in field.value
                        ? (field.value as Date).toISOString().split("T")[0]
                        : field.value || ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name={"employmentType" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">Employment Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="bg-header-bg w-full border-gray-200 h-12!">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    "full-time",
                    "part-time",
                    "contract",
                    "freelance",
                    "internship",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"experienceLevel" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">Experience Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                disabled={disabled}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="h-12! bg-header-bg w-full border-gray-200">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    "Entry Level",
                    "Junior",
                    "Mid Level",
                    "Senior",
                    "Executive",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};
