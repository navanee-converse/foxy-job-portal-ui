import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Edit3, Users, Save, Globe, X } from "lucide-react";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { request } from "@/services/api";
import { jobSchema, type JobFormValues } from "@/validations/job";
import { RoleOverviewSection } from "./sections/RoleOverview";
import { SalarySection } from "./sections/Salary";
import { DynamicListSection } from "./DynamicListSelection";
import { JobDescriptionField } from "./fields/JobDescription";
import { TagSelectorField } from "./TagSelector";

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 New state to track mode

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as Resolver<JobFormValues>,
    mode: "onChange",
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response: any = await request(`/jobs/${id}`, "GET");
        const jobData = response;

        const flattenedTags =
          jobData.jobTags?.map((item: any) => ({
            _id: item.tagId._id,
            name: item.tagId.name,
            slug: item.tagId.slug,
          })) || [];

        form.reset({
          ...jobData,
          lastDate: jobData.lastDate ? new Date(jobData.lastDate) : new Date(),
          tagIds: flattenedTags,
        });
      } catch (err) {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id, form, navigate]);

  const handleJobUpdate = async (
    values: JobFormValues,
    newStatus: "published" | "draft",
  ) => {
    setIsSubmitting(true);
    try {
      const tagIdsOnly = values.tagIds.map((tag: any) =>
        typeof tag === "string" ? tag : tag._id,
      );

      const payload = { ...values, tagIds: tagIdsOnly, status: newStatus };
      await request(`/jobs/${id}`, "PATCH", payload);

      toast.success(
        newStatus === "published" ? "Job published!" : "Draft updated!",
      );
      setIsEditing(false); // 👈 Switch back to view mode after success
    } catch (err) {
      toast.error("Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 animate-pulse">Loading job data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Dynamic Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 flex justify-between items-center">
        <h1 className="font-bold text-4xl text-slate-900">
          {isEditing ? "Editing Job Listing" : "Job Overview"}
        </h1>

        {/* Mode Toggle Buttons */}
        {!isEditing && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 border-slate-300"
              onClick={() => navigate(`/jobs/${id}/applications`)}
            >
              <Users className="w-4 h-4" /> Applications
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4" /> Edit Job
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center w-full px-4">
        <Form {...form}>
          <form className="space-y-12 bg-white p-10 w-full max-w-7xl rounded-xl shadow-sm border border-slate-200">
            <fieldset
              disabled={!isEditing}
              className="space-y-12 disabled:opacity-80"
            >
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

              <DynamicListSection
                control={form.control}
                name="responsibilities"
                title="Responsibilities"
                placeholder={isEditing ? "Add a responsibility..." : ""}
              />
              <Separator />

              <DynamicListSection
                control={form.control}
                name="skillsAndQualifications"
                title="Skills & Qualifications"
                placeholder={isEditing ? "Add a skill..." : ""}
              />
              <Separator />

              <JobDescriptionField control={form.control} />
            </fieldset>

            {isEditing && (
              <div className="flex justify-end items-center gap-4 pt-8 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-500 hover:text-red-600"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="px-8 h-12"
                  onClick={form.handleSubmit((data) =>
                    handleJobUpdate(data, "draft"),
                  )}
                >
                  Save as Draft
                </Button>

                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 px-10 h-12 text-white shadow-md"
                  onClick={form.handleSubmit((data) =>
                    handleJobUpdate(data, "published"),
                  )}
                >
                  {isSubmitting ? "Processing" : "Publish"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateJob;
