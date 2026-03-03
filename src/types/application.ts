export interface Application {
  _id: string;
  jobId: string;
  resumeUrl: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
  createdAt: string;
  candidateId: {
    _id: string;
    email: string;
  };
}

export interface Education {
  _id: string;
  level: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

export interface Experience {
  _id: string;
  company: string;
  title: string;
  startYear: number;
  endYear?: number | string;
}

export interface JobSeekerProfile {
  _id: string;
  resumes: string[];
  primaryResumeUrl: string;
  education: Education[];
  experience: Experience[];
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobSeekerProfileId: JobSeekerProfile;
}

export interface Job {
  _id: string;
  title: string;
  companyId: string;
}
export interface ITag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface IUserTag {
  _id: string;
  tagId: ITag;
}

export interface ApplicationDetailResponse {
  _id: string;
  jobId: Job;
  candidateId: Candidate;
  resumeUrl: string;
  status: Status;
  appliedAt: string;
  tags: IUserTag[];
}
export type Status =
  | "pending"
  | "viewed"
  | "shortlisted"
  | "rejected"
  | "scheduled";
