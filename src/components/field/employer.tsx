import type { Control, FieldValues, Path } from "react-hook-form";
import { FormInput } from "../form-input";

export const EmployerFields = <T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
    <FormInput
      name={"jobtitle" as Path<T>}
      label="Job Title"
      placeholder="job title"
      control={control}
      disabled={false}
      className="w-full"
      required={true}
    />
    <FormInput
      name={"department" as Path<T>}
      label="Department"
      placeholder="department"
      control={control}
      disabled={false}
      className="w-full"
    />
  </div>
);
