import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateEmployerProfileSchema } from "@/validations/employer";
import { updateUserSchema } from "@/validations/user";
import z from "zod";
import { Separator } from "../ui/separator";
import { ProfileFields } from "../fields/Profile";
import { EmployerFields } from "../fields/Employer";
import type { ProfileFormValues } from "@/types/user-profile";
import { useNavigate } from "react-router-dom";

const employerSchema = updateEmployerProfileSchema.extend({
  name: updateUserSchema.shape.name,
  phone: updateUserSchema.shape.phone,
});

export const EmployerProfileForm = ({
  initialData,
  onSave,
  isSubmitting,
}: {
  initialData: ProfileFormValues | undefined;
  onSave: (values: any) => void;
  isSubmitting: boolean;
}) => {
  const form = useForm<z.infer<typeof employerSchema>>({
    resolver: zodResolver(employerSchema),
    defaultValues: initialData,
  });
  const navigate = useNavigate();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Basic Details</h2>
          <ProfileFields control={form.control} role="employer" />
        </section>
        <Separator />
        <EmployerFields control={form.control} />
        <div className="flex justify-end gap-4 pt-4">
          {initialData?.company ? (
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className="bg-brand-primary hover:bg-brand-btn-hover px-10 h-12 text-white font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </Button>
          ) : (
            <Button
              className="bg-brand-primary hover:bg-brand-btn-hover px-10 h-12 text-white font-bold"
              onClick={() => navigate("/company")}
            >
              Create Company
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
