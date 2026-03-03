import type { CompanyDto } from "@/validations/company";
import type {
  Education,
  Experience,
  JobSeekerProfile,
} from "./job-seeker-profile";
import type { EmployerProfile } from "./employer-profile";
import type { Tag } from "./tag";

export type UserMeResponse = {
  _id: string;
  id: string;

  email: string;
  emailVerified: boolean;

  otp: string | null;
  otpVerified: boolean;
  otpExpiredAt: string | null;

  companyId: CompanyDto | null;
  employerProfileId: EmployerProfile | null;

  role: string;
  roleName: string;
  name: string;
  phone: string | null;
  tagIds?: Tag[];

  jobSeekerProfileId: JobSeekerProfile | null;

  createdAt: string;
  updatedAt: string;
};

interface UnifiedProfileData {
  name: string;
  phone: string;
  email?: string;
  education: Education[];
  company?: string;
  experience: Experience[];
  tagIds: Tag[];
  jobtitle: string;
  department: string;
}

export type ProfileFormValues = UnifiedProfileData & { resume?: File };
