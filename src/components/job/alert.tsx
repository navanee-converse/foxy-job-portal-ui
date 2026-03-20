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
import { Edit2 } from "lucide-react"; // Optional: for the button icon

export const JobAlertScreen = () => {
  const [mode, setMode] = useState<"create" | "update">("create");
  // 1. Add state to track if we are currently editing
  const [isEditing, setIsEditing] = useState(false);

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

  // 2. Determine if fields should be disabled
  // Logic: Disable if we are in "update" mode AND "isEditing" is false.
  // In "create" mode, it is never disabled.
  const isFieldsDisabled = mode === "update" && !isEditing;

  useEffect(() => {
    async function init() {
      try {
        const data = await request<JobAlert>("/users/me/alert", "GET");
        if (data) {
          setMode("update");
          setIsEditing(false); // Ensure it starts in read-only mode for updates

          form.reset({
            ...data,
            ...data.filters,
            tagIds: data.filters?.tagIds || [],
          });
        } else {
          setMode("create");
          setIsEditing(true); // Always "editing" in create mode
        }
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          toast.error(apiError.message);
        } else toast.error("Failed to load job alert");
      }
    }
    init();
  }, [form]);

  const onSubmit = async (values: AlertFormValues) => {
    try {
      const payload = {
        ...values,
        tagIds: values.tagIds.map((tag) => tag.id), // Changed tag.id to tag._id based on your previous code
      };

      const method = mode === "update" ? "PUT" : "POST";
      await request("/users/me/alert", method, payload);
      
      setMode("update");
      setIsEditing(false); // Go back to read-only after saving
      toast.success(`Alert ${mode === "update" ? "updated" : "created"} successfully!`);
    } catch (error) {
      toast.error("Failed to save alert");
    }
  };

  return (
    <div className="bg-header-bg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto p-8 space-y-8"
        >
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-medium">
              {mode === "update" ? "Job Alert" : "Create Alert"}
            </h1>
            
            {mode === "update" && !isEditing && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2  text-white bg-brand-primary hover:text-white hover:bg-brand-btn-hover cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit Alert
              </Button>
            )}
          </div>

          <div className="space-y-10 border border-slate-200 p-10 rounded-lg bg-white">
            <RoleOverviewSection 
               control={form.control} 
               showLastDate={false} 
               showOpenings={false} 
               disabled={isFieldsDisabled} 
            />
            <AlertFilterFields 
               control={form.control} 
               disabled={isFieldsDisabled} 
            />
            <TagSelectorField 
               control={form.control} 
               disabled={isFieldsDisabled} 
            />
            
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
                        Turn this off to stop receiving notifications.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isFieldsDisabled}
                        className="data-[state=checked]:bg-blue-500 cursor-pointer"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* 5. Only show the Submit button if we are in "Create" mode or actively "Editing" */}
            {(mode === "create" || isEditing) && (
              <div className="flex justify-center w-full gap-4">
                {isEditing && mode === "update" && (
                   <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    className="cursor-pointer"
                   >
                    Cancel
                   </Button>
                )}
                <Button
                  type="submit"
                  className="p-5 bg-brand-primary cursor-pointer hover:bg-brand-btn-hover text-white"
                >
                  {mode === "update" ? "Save Changes" : "Create Alert"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};