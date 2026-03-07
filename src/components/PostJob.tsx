import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { jobSchema, type JobFormValues } from "@/validations/job";
import { request } from "@/services/api";
import { DynamicListSection } from "./DynamicListSelection";
import { JobDescriptionField } from "./fields/JobDescription";
import { TagSelectorField } from "./TagSelector";
import { SalarySection } from "./sections/Salary";
import { RoleOverviewSection } from "./sections/RoleOverview";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { TagOption } from "@/types/tag";

const PostJob = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as Resolver<JobFormValues>,
    defaultValues: {
      title: "",
      responsibilities: [""],
      skillsAndQualifications: [""],
      status: "published",
      location: "onsite",
      description: "",
      minSalary: 0,
      maxSalary: 0,
      employmentType: "full-time",
      experienceLevel: "Entry Level",
      lastDate: new Date(),
      tagIds: [],
    },
  });

  const handleJobAction = async (
    values: JobFormValues,
    status: "published" | "draft",
  ) => {
    setIsSubmitting(true);
    try {
      const tagIdsOnly = values.tagIds.map((tag: TagOption) => tag._id);

      const payload = {
        ...values,
        tagIds: tagIdsOnly,
        status: status,
      };

      await request("/jobs", "POST", payload);
      toast.success(
        status === "published" ? "Job published!" : "Saved to drafts",
      );
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save job");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <h1 className="font-semibold text-4xl text-slate-900">
          Post a New Job
        </h1>
      </div>

      <div className="flex justify-center w-full px-4">
        <Form {...form}>
          <form className="space-y-12 bg-white p-10 w-full max-w-7xl rounded-xl shadow-sm border border-slate-200">
            <RoleOverviewSection control={form.control} />
            <Separator />

            <SalarySection control={form.control} />
            <Separator />

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                Classification
              </h2>
              <TagSelectorField control={form.control} />
            </section>
            <Separator />
            <div>
              <DynamicListSection
                control={form.control}
                name="responsibilities"
                title="Responsibilities"
                placeholder="Describe a duty..."
              />
            </div>
            <Separator />

            <DynamicListSection
              control={form.control}
              name="skillsAndQualifications"
              title="Skills & Qualifications"
              placeholder="Describe skills..."
            />
            <Separator />

            <JobDescriptionField control={form.control} />

            <div className="flex justify-end items-center gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="px-8 h-12 bg-gray-500 text-white hover:text-white hover:bg-gray-600 cursor-pointer"
                onClick={form.handleSubmit((data: JobFormValues) =>
                  handleJobAction(data, "draft"),
                )}
              >
                Save as Draft
              </Button>

              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-brand-primary hover:bg-brand-btn-hover cursor-pointer px-12 h-14 text-lg font-bold text-white"
                onClick={form.handleSubmit((data: JobFormValues) =>
                  handleJobAction(data, "published"),
                )}
              >
                {isSubmitting ? "Processing..." : "Publish"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostJob;
