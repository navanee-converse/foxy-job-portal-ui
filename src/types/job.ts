export interface JobLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CompanySocials {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface Company {
  _id: string;
  name: string;
  location: JobLocation;
  socials: CompanySocials;
  website: string;
  industry: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
}

export interface TagDetails {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobTag {
  _id: string;
  jobId: string;
  tagId: TagDetails;
  createdAt: string;
  updatedAt: string;
}

export interface JobUser {
  _id: string;
  email: string;
}

export interface Job {
  _id: string;
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  skillsAndQualifications: string[];
  companyId: Company;
  numberOfPositions: number;
  postedByUserId: JobUser;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel: string;
  minSalary: number;
  isSaved?: boolean;
  isApplied?: boolean;
  maxSalary: number;
  lastDate?: string;
  location: "remote" | "onsite" | "hybrid";
  status: "published" | "draft" | "closed";
  jobTags: JobTag[];
  createdAt: string;
  updatedAt: string;
}
