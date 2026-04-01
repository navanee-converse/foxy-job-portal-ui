import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import z from "zod";

import { updateJobSeekerProfileSchema } from "@/validations/job-seeker";
import { updateUserSchema } from "@/validations/user";
import { ProfileFields } from "../field/profile";
import { Separator } from "../ui/separator";
import { JobSeekerFields } from "../field/job-seeker";
import { TagSelectorField } from "../field/tag-selector";
import { FileField } from "../field/file";

const jobSeekerSchema = updateJobSeekerProfileSchema.extend({
  name: updateUserSchema.shape.name,
  phone: updateUserSchema.shape.phone,
  resume: z.instanceof(File).optional(),
});

type JobSeekerFormValues = z.infer<typeof jobSeekerSchema>;

interface JobSeekerProfileFormProps {
  initialData: Partial<JobSeekerFormValues>;
  onSave: (data: JobSeekerFormValues) => void;
  isSubmitting: boolean;
  resumeUrl?: string;
  onRemoveResume: () => void;
  isSyncing: boolean;
}

export const JobSeekerProfileForm = ({
  initialData,
  onSave,
  isSubmitting,
  resumeUrl,
  onRemoveResume,
  isSyncing,
}: JobSeekerProfileFormProps) => {
  const form = useForm<JobSeekerFormValues>({
    resolver: zodResolver(jobSeekerSchema) as Resolver<JobSeekerFormValues>,
    defaultValues: {
      ...initialData,
      education: initialData.education?.length
        ? initialData.education
        : [
            {
              level: "bachelor",
              degree: "",
              institution: "",
              fieldOfStudy: "",
              percentage: 0,
              startYear: new Date().getFullYear() - 4,
              endYear: new Date().getFullYear(),
            },
          ],
    },
    shouldFocusError: true,
    mode: "onBlur",
  });

  useEffect(() => {
    if (resumeUrl && !isSyncing) {
      form.resetField("resume", { defaultValue: undefined });
    }
  }, [resumeUrl, isSyncing, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Basic Details
          </h2>
          <ProfileFields control={form.control} />
        </section>

        <Separator />

        <FileField
          control={form.control}
          existingUrl={resumeUrl}
          onRemoveExisting={onRemoveResume}
          isSyncing={isSyncing}
        />
        <Separator />

        <JobSeekerFields control={form.control} />
        <Separator />

        <TagSelectorField control={form.control} required={false} />
        <div className="flex justify-center gap-4 pt-4 sm:justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
            className="bg-brand-primary hover:bg-brand-btn-hover cursor-pointer px-10 h-12 text-white font-bold transition-all active:scale-95"
          >
            {isSubmitting ? "Saving Profile..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
