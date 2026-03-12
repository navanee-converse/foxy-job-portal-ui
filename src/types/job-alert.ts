import type { Tag } from "@/types/tag";

export interface JobAlertFilters {
  tagIds: Tag[];
  location: "onsite" | "remote" | "hybrid";
  experienceLevel:
    | "Entry Level"
    | "Mid Level"
    | "Senior"
    | "Junior"
    | "Director"
    | "Executive";
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "freelance";
  minSalary: number;
}

export interface JobAlert {
  id: string;
  _id: string;
  userId: string;
  title: string;
  frequency: "daily" | "weekly" ;
  isEnabled: boolean;
  filters: JobAlertFilters;
  createdAt: string;
  updatedAt: string;
  lastRunAt: string | null;
}
