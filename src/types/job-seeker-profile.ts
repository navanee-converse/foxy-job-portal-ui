export type Experience = {
  _id?: string;
  id?: string;

  company?: string;
  title?: string;

  startYear?: number;
  endYear?: number;
};

export type Education = {
  _id?: string;
  id?: string;

  level: "sslc" | "hsc" | "diploma" | "bachelor" | "master" | "phd";
  degree?: string;
  fieldOfStudy?: string | null;
  institution?: string;

  startYear?: number;
  endYear?: number;
  percentage?: number;
};

export type JobSeekerProfile = {
  _id: string;
  id: string;

  userId: string;

  resumes: string[];
  primaryResumeUrl: string | null;

  certifications: string[];

  education: Education[];
  experience: Experience[];

  createdAt: string;
  updatedAt: string;
};
