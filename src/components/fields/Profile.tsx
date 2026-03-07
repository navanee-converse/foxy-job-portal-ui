import type { Control, FieldValues } from "react-hook-form";
import { FormInput } from "../FormInput";

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
        name="name"
        label="Full Name"
        placeholder="full name"
        control={control}
        disabled={false}
        className="w-full"
        required={true}
      />
      <FormInput
        name="phone"
        label="Phone Number"
        placeholder="phone number"
        control={control}
        disabled={false}
        className="w-full"
        required={true}
      />
      <FormInput
        name="email"
        label="Email"
        placeholder="email"
        control={control}
        disabled={true}
        className="w-full"
        required={true}
      />
      {role === "employer" && (
        <FormInput
        name="company"
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
