import { useFieldArray, type Control } from "react-hook-form";
import { FormInput } from "../FormInput";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "../ui/separator";

export const JobSeekerFields = ({ control }: { control: Control<any> }) => {
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const eduLevels = ["sslc", "hsc", "diploma", "bachelor", "master", "phd"];

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Education *</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendEdu(
                {
                  level: "bachelor",
                  degree: "",
                  institution: "",
                  fieldOfStudy: "",
                  percentage: "",
                  startYear: 2020,
                  endYear: 2024,
                },
                { shouldFocus: false },
              )
            }
            className="h-8 text-xs border-slate-200 hover:border-slate-300"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>

        {eduFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative space-y-4"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-600 z-10"
              onClick={() => removeEdu(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 mb-12">
              <FormField
                control={control}
                name={`education.${index}.level`}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-sm mt-1.5">Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm border border-slate-200 w-full h-12!">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eduLevels.map((l) => (
                          <SelectItem key={l} value={l} className="capitalize">
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormInput
                name={`education.${index}.degree`}
                label="Degree"
                placeholder="B.Tech"
                control={control}
                className="h-12 mt-1.5 "
                disabled={false}
              />

              <div className="col-span-2 mb-8">
                <FormInput
                  name={`education.${index}.institution`}
                  label="Institution"
                  placeholder="University name"
                  control={control}
                  className="h-12"
                  disabled={false}
                />
              </div>

              <FormInput
                name={`education.${index}.fieldOfStudy`}
                label="Field OF Study"
                placeholder="Computer Science"
                control={control}
                className="h-12 mb-8"
                disabled={false}
              />
              <FormInput
                name={`education.${index}.percentage`}
                label="Percentage"
                placeholder="80"
                control={control}
                className="h-12"
                disabled={false}
              />

              <FormInput
                name={`education.${index}.startYear`}
                label="Start Year"
                control={control}
                className="h-12"
                disabled={false}
              />
              <FormInput
                name={`education.${index}.endYear`}
                label="End Year"
                control={control}
                className="h-12"
                disabled={false}
              />
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Experience *</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendExp({
                company: "",
                title: "",
                startYear: 2024,
                endYear: 2026,
              })
            }
            className="h-8 text-xs border-slate-200 hover:border-slate-300"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div> 

        {expFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 relative space-y-4"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-600 z-10"
              onClick={() => removeExp(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-2 gap-x-4 gap-y-14">
              <FormInput
                name={`experience.${index}.company`}
                label="Company"
                placeholder="Company name"
                control={control}
                className="h-9"
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.title`}
                label="Job Title"
                placeholder="Position"
                control={control}
                className="h-9"
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.startYear`}
                label="Start Year"
                control={control}
                className="h-9"
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.endYear`}
                label="End Year"
                control={control}
                className="h-9 mb-12"
                disabled={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
