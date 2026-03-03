import type { Control } from "react-hook-form";
import { FormInput } from "../FormInput";

export const EmployerFields = ({ control }: { control: Control<any> }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
    <FormInput
      name="jobtitle"
      label="Job Title"
      placeholder="job title"
      control={control}
      disabled={false}
      className="w-full"
    />
    <FormInput
      name="department"
      label="Department"
      placeholder="department"
      control={control}
      disabled={false}
      className="w-full"
    />
  </div>
);
