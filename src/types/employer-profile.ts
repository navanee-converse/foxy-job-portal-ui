export type EmployerProfile = {
  _id: string;

  userId: string;
  companyId: string;

  jobTitle: string;
  department?: string;

  createdAt: string;
  updatedAt: string;
};
