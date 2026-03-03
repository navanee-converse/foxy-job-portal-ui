import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  updateJobSeekerProfileSchema,
  type UpdateJobSeekerProfileDto,
} from "@/validations/job-seeker";
import { updateUserSchema } from "@/validations/user";
import z from "zod";
import { ProfileFields } from "../fields/Profile";
import { Separator } from "../ui/separator";
import { JobSeekerFields } from "../fields/JobSeeker";
import { FileField } from "../fields/File";
import { TagSelectorField } from "../TagSelector";
import { useEffect } from "react";

const jobSeekerSchema = updateJobSeekerProfileSchema.extend({
  name: updateUserSchema.shape.name,
  phone: updateUserSchema.shape.phone,
  resume: z.instanceof(File).optional(),
});

export const JobSeekerProfileForm = ({
  initialData,
  onSave,
  isSubmitting,
  resumeUrl,
  onRemoveResume,
  isSyncing,
}: any) => {
  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(
      jobSeekerSchema,
    ) as Resolver<UpdateJobSeekerProfileDto>,
    defaultValues: initialData,
    shouldFocusError: true,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
  if (resumeUrl && !isSyncing) {
    form.resetField("resume", { defaultValue: undefined });
  }
}, [resumeUrl, isSyncing, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
        <section className="space-y-6 ">
          <h2 className="text-xl font-bold text-slate-800">Basic Details</h2>
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
        <TagSelectorField control={form.control} />
        <div className="flex justify-end gap-4 pt-4">
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
        </div>
      </form>
    </Form>
  );
};
