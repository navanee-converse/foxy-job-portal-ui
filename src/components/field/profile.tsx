import type { Control, FieldValues, Path } from "react-hook-form";
import { FormInput } from "../form-input";

interface ProfileFieldsProps<T extends FieldValues> {
  control: Control<T>;
  role?: string;
}
export const ProfileFields = <T extends FieldValues>({
  control,
  role,
}: ProfileFieldsProps<T>) => {
  const gridCols = role === "employer" ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols} items-start`}>
      <FormInput
        name={"name" as Path<T>}
        label="Full Name"
        placeholder="full name"
        control={control}
        disabled={false}
        className="w-full"
        required={true}
      />
      <FormInput
        name={"phone" as Path<T>}
        label="Phone Number"
        placeholder="phone number"
        control={control}
        disabled={false}
        className="w-full"
        required={true}
      />
      <FormInput
        name={"email" as Path<T>}
        label="Email"
        placeholder="email"
        control={control}
        disabled={true}
        className="w-full"
        required={true}
      />
      {role === "employer" && (
        <FormInput
          name={"company" as Path<T>}
          label="Company Name "
          placeholder="company name"
          control={control}
          disabled={true}
          className="w-full"
        />
      )}
    </div>
  );
};
