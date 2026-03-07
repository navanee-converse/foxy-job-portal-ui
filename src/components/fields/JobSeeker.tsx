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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800 label-required">
              Education
            </h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendEdu({
                level: "bachelor",
                degree: "",
                institution: "",
                fieldOfStudy: "",
                percentage: "",
                startYear: 2020,
                endYear: 2024,
              })
            }
            className="text-blue-600 border-blue-200 hover:bg-brand-primary hover:text-white cursor-pointer"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>

        {eduFields.map((field, index) => (
          <div
            key={field.id}
            className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-600 cursor-pointer z-10"
              onClick={() => removeEdu(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={control}
                name={`education.${index}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border w-full h-12! border-slate-200">
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
                className="mt-0.5"
                disabled={false}
              />

              <FormInput
                name={`education.${index}.fieldOfStudy`}
                label="Field of Study"
                placeholder="Computer Science"
                control={control}
                disabled={false}
              />

              <FormInput
                name={`education.${index}.percentage`}
                label="Percentage"
                placeholder="80"
                control={control}
                disabled={false}
              />

              <FormInput
                name={`education.${index}.startYear`}
                label="Start Year"
                control={control}
                disabled={false}
              />

              <FormInput
                name={`education.${index}.endYear`}
                label="End Year"
                control={control}
                disabled={false}
              />

              <div className="md:col-span-2">
                <FormInput
                  name={`education.${index}.institution`}
                  label="Institution"
                  placeholder="University name"
                  control={control}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800 label-required">
              Experience
            </h3>
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
            className="text-blue-600 border-blue-200 hover:bg-brand-primary hover:text-white cursor-pointer"
          >
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>

        {expFields.map((field, index) => (
          <div
            key={field.id}
            className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-600 cursor-pointer z-10"
              onClick={() => removeExp(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <FormInput
                name={`experience.${index}.company`}
                label="Company"
                placeholder="Company name"
                control={control}
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.title`}
                label="Job Title"
                placeholder="Position"
                control={control}
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.startYear`}
                label="Start Year"
                control={control}
                disabled={false}
              />
              <FormInput
                name={`experience.${index}.endYear`}
                label="End Year"
                control={control}
                disabled={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
