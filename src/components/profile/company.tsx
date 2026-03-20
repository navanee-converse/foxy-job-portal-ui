import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { request } from "@/services/api";
import { Pencil, X } from "lucide-react";
import { FormInput } from "../form-input";
import { companySchema, type CompanyDto } from "@/validations/company";
import type { Company } from "@/types/job";
import type { ApiError } from "@/types/response";

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const form = useForm<CompanyDto>({
    resolver: zodResolver(companySchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      website: "",
      location: { city: "", state: "", country: "", address: "", zipCode: "" },
      socials: { linkedin: "", twitter: "", facebook: "" },
      industry: "",
      size: "",
      aboutCompany: "",
    },
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await request<Company>("/companies", "GET");
        if (response && response.name) {
          form.reset(response);
          setHasExistingData(true);
          setIsEditMode(false);
        } else {
          setIsEditMode(true);
        }
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const apiError = error as ApiError;
          toast.error(apiError.message);
        } else {
          toast.error("Unexpected error occured");
        }
        setIsEditMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [form]);

  const onSubmit = async (values: CompanyDto) => {
    try {
      await request("/companies", "PUT", values);
      toast.success("Profile updated successfully!");
      setHasExistingData(true);
      setIsEditMode(false);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        toast.error(apiError.message);
      } else toast.error("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Profile...
      </div>
    );

  return (
    <div className="bg-header-bg min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 flex justify-between items-center">
        <h1 className="font-semibold text-4xl text-slate-900">
          Company Profile
        </h1>
        {hasExistingData && (
          <Button
            type="button"
            variant={isEditMode ? "ghost" : "outline"}
            onClick={() => {
              if (isEditMode) form.reset();
              setIsEditMode(!isEditMode);
            }}
            className={
              isEditMode
                ? "text-red-500 hover:text-red-600 hover:bg-transparent"
                : "bg-brand-primary text-white hover:text-white hover:bg-brand-btn-hover"
            }
          >
            {isEditMode ? (
              <>
                <X className="w-4 h-4 mr-2 hover:bg-header-bg" /> Cancel
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex justify-center w-full px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-12 bg-white p-10 w-full max-w-7xl rounded-xl shadow-sm border border-slate-200"
          >
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                Basic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormInput
                  name="name"
                  label="Company Name"
                  control={form.control}
                  disabled={!isEditMode}
                  required={true}
                />
                <FormInput
                  name="website"
                  label="Website"
                  control={form.control}
                  disabled={!isEditMode}
                  required={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="label-required">
                        Team Size
                      </FormLabel>
                      <Select
                        disabled={!isEditMode}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-header-bg h-12 border border-slate-200">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["1-10", "11-50", "51-200", "201+"].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s} employees
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="label-required">Industry</FormLabel>
                      <Select
                        disabled={!isEditMode}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-header-bg h-12 border border-slate-200 focus:ring-0 focus:ring-offset-0 focus:outline-none">
                            {" "}
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Technology",
                            "Finance",
                            "Healthcare",
                            "Education",
                            "Retail",
                          ].map((i) => (
                            <SelectItem key={i} value={i}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <Separator />

            <section className="space-y-6">
              <FormField
                control={form.control}
                name="aboutCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-800">
                      About Company
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={!isEditMode}
                        className="bg-header-bg border-slate-200 min-h-45"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            <Separator />

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">
                Location Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  name="location.address"
                  label="Address"
                  control={form.control}
                  disabled={!isEditMode}
                />
                <FormInput
                  name="location.city"
                  label="City"
                  control={form.control}
                  disabled={!isEditMode}
                  required={true}
                />
                <FormInput
                  name="location.state"
                  label="State"
                  control={form.control}
                  disabled={!isEditMode}
                  required={true}
                />
                <FormInput
                  name="location.country"
                  label="Country"
                  control={form.control}
                  disabled={!isEditMode}
                  required={true}
                />
                <FormInput
                  name="location.zipCode"
                  label="Zipcode"
                  control={form.control}
                  disabled={!isEditMode}
                />
              </div>
            </section>

            <Separator />

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  name="socials.facebook"
                  label="Facebook"
                  control={form.control}
                  disabled={!isEditMode}
                />
                <FormInput
                  name="socials.twitter"
                  label="Twitter"
                  control={form.control}
                  disabled={!isEditMode}
                />
                <FormInput
                  name="socials.linkedin"
                  label="LinkedIn"
                  control={form.control}
                  disabled={!isEditMode}
                />
              </div>
            </section>

            {isEditMode && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-btn-hover cursor-pointer px-12 h-14 text-lg font-bold"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanyProfile;
