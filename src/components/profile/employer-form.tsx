import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateEmployerProfileSchema } from "@/validations/employer";
import { updateUserSchema } from "@/validations/user";
import z from "zod";
import { useEffect } from "react";
import { Separator } from "../ui/separator";
import { ProfileFields } from "../field/profile";
import type { ProfileFormValues } from "@/types/user-profile";
import { useNavigate } from "react-router-dom";
import { EmployerFields } from "../field/employer";
import { Loader2 } from "lucide-react";

const employerSchema = updateEmployerProfileSchema.extend({
  name: updateUserSchema.shape.name,
  phone: updateUserSchema.shape.phone,
});
type EmployerFormValues = z.infer<typeof employerSchema>;

export const EmployerProfileForm = ({
  initialData,
  onSave,
  isSubmitting,
  isDisabled,
}: {
  initialData: ProfileFormValues | undefined;
  onSave: (values: EmployerFormValues) => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}) => {
  const form = useForm<EmployerFormValues>({
    resolver: zodResolver(employerSchema),
    defaultValues: initialData,
    disabled: isDisabled || isSubmitting, 
  });

  const navigate = useNavigate();
  const isReadOnly = !initialData?.company;

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <fieldset 
          disabled={isDisabled || isSubmitting || isReadOnly} 
          className="space-y-8 disabled:opacity-90 transition-opacity"
        >
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Basic Details</h2>
            <ProfileFields control={form.control} role="employer" />
          </section>
          <Separator />
          <EmployerFields control={form.control} />
        </fieldset>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          {!isDisabled ? (
            !isReadOnly ? (
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isDirty}
                className="bg-brand-primary hover:bg-brand-btn-hover px-10 h-12 text-white font-bold cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Profile"
                )}
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-destructive font-medium">
                  Please create a company to edit your profile.
                </p>
                <Button
                  type="button"
                  className="bg-brand-primary hover:bg-brand-btn-hover px-10 h-12 text-white font-bold cursor-pointer"
                  onClick={() => navigate("/company")}
                >
                  Create Company
                </Button>
              </div>
            )
          ) : null}
        </div>
      </form>
    </Form>
  );
};