import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { request } from "@/services/api";
import { TagSelectorField } from "./TagSelector";
import { Button } from "@/components/ui/button";
import { alertSchema, type AlertFormValues } from "@/validations/alert";
import toast from "react-hot-toast";
import { RoleOverviewSection } from "./sections/RoleOverview";
import { AlertFilterFields } from "./AlertFilterFields";

export const JobAlertScreen = () => {
  const [mode, setMode] = useState<"create" | "update">("create");
  const [loading, setLoading] = useState(true);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema) as Resolver<AlertFormValues>,
    defaultValues: {
      title: "",
      frequency: "weekly",
      tagIds: [],
      location: "onsite",
      employmentType: "full-time",
      experienceLevel: "Entry Level",
      minSalary: undefined,
    },
  });

  useEffect(() => {
    async function init() {
      try {
        const data = await request("/users/me/alerts", "GET");
        if (data) {
          setMode("update");

          form.reset({
            ...data,
            ...data.filters,
            tagIds: data.filters?.tagIds || [],
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const onSubmit = async (values: AlertFormValues) => {
    const payload = {
      ...values,
      tagIds: values.tagIds.map((t) => t.id),
    };

    const method = mode === "update" ? "PUT" : "POST";
    await request("/users/me/alerts", method, payload);
    toast.success(`Alert ${mode}d successfully!`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-8 space-y-8"
      >
        <h1 className="text-3xl font-medium mb-10">
          {mode === "update" ? "Update Alert" : "Create Alert"}
        </h1>
        <RoleOverviewSection control={form.control} showLastDate={false} />
        <AlertFilterFields control={form.control} />
        <TagSelectorField control={form.control} />

        <div className="flex justify-center w-full">
          <Button type="submit" className="p-5">
            {mode === "update" ? "Save Changes" : "Create Alert"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
