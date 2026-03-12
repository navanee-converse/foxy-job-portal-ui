import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { request } from "@/services/api";
import { TagSelectorField } from "../field/tag-selector";
import { Button } from "@/components/ui/button";
import { alertSchema, type AlertFormValues } from "@/validations/alert";
import toast from "react-hot-toast";
import { RoleOverviewSection } from "../section/role-overview";
import { AlertFilterFields } from "../field/alert-filter";
import { Switch } from "@/components/ui/switch";
import type { JobAlert } from "@/types/job-alert";
import type { ApiError } from "@/types/response";

export const JobAlertScreen = () => {
  const [mode, setMode] = useState<"create" | "update">("create");
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
      isEnabled: true,
    },
  });

  useEffect(() => {
    async function init() {
      try {
        const data = await request<JobAlert>("/users/me/alert", "GET");
        if (data) {
          setMode("update");

          form.reset({
            ...data,
            ...data.filters,
            tagIds: data.filters?.tagIds || [],
          });
        }
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          toast.error(apiError.message);
        } else toast.error("Falied To create jon alert");
      }
    }
    init();
  }, [form]);

  const onSubmit = async (values: AlertFormValues) => {
    const payload = {
      ...values,
      tagIds: values.tagIds.map((tag) => tag.id),
    };

    const method = mode === "update" ? "PUT" : "POST";
    await request("/users/me/alert", method, payload);
    toast.success(`Alert ${mode}d successfully!`);
  };

  return (
    <div className="bg-header-bg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto p-8 space-y-8"
        >
          <h1 className="text-3xl font-medium mb-10">
            {mode === "update" ? "Update Alert" : "Create Alert"}
          </h1>
          <div className="space-y-8 border border-slate-200 p-10 rounded-lg bg-white">
            <RoleOverviewSection control={form.control} showLastDate={false} />
            <AlertFilterFields control={form.control} />
            <TagSelectorField control={form.control} />
            {mode === "update" && (
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4 bg-header-bg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">
                        Alert Status
                      </FormLabel>
                      <FormDescription>
                        {`Turn this off to stop receiving notifications.`}
                      </FormDescription>
                    </div>
                    <FormControl className="text-blue-500 bg-blue-600">
                      <Switch
                        className="data-[state=checked]:bg-blue-500 cursor-pointer"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-center w-full">
              <Button
                type="submit"
                className="p-5 bg-brand-primary cursor-pointer hover:bg-brand-btn-hover text-white"
              >
                {mode === "update" ? "Save Changes" : "Create Alert"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
