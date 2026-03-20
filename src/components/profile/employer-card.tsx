import {
  Mail,
  Building2,
  Briefcase,
  LayoutGrid,
  Shield,
  QrCode,
} from "lucide-react";
import type { ProfileFormValues } from "@/types/user-profile";
import { Avatar, InfoRow, SectionTitle } from "./job-seeker-card";

interface EmployerIDCardProps {
  name?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  email?: string;
  employeeId?: string;
}

export const EmployerIDCard = ({
  name,
  jobTitle,
  department,
  company,
  email,
  employeeId,
}: EmployerIDCardProps) => {
  const id = employeeId || Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-blue-900/20 blur-sm" />

      <div className="relative rounded-lg overflow-hidden border border-blue-100 shadow-xl bg-white">
        <div className="h-3 bg-linear-to-r from-blue-600 to-indigo-600" />

        <div className="px-6 py-4 bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight truncate max-w-40">
              {company || "Company"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-blue-200" />
            <span className="text-blue-200 text-xs font-semibold">STAFF</span>
          </div>
        </div>

        <div className="px-6 py-5 flex items-start gap-5">
          <div className="shrink-0">
            <Avatar name={name} size="lg" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-lg font-bold text-slate-900 leading-tight truncate">
              {name || "—"}
            </p>
            {jobTitle && (
              <p className="text-sm font-semibold text-blue-600 truncate">
                {jobTitle}
              </p>
            )}
            {department && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">
                <LayoutGrid className="w-3 h-3" />
                {department}
              </span>
            )}
            {email && (
              <div className="flex items-center gap-1.5 pt-1">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 truncate">{email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-5 flex items-center justify-between">
          <div className="w-14 h-14 rounded-lg bg-slate-900 p-1.5 flex items-center justify-center">
            <QrCode className="w-full h-full text-white" />
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">EMPLOYEE ID</p>
            <p className="text-base font-bold text-slate-700 font-mono tracking-widest">
              {id}
            </p>
          </div>
        </div>

        <div className="h-2 bg-linear-to-r from-blue-600 to-indigo-600" />
      </div>
    </div>
  );
};

interface EmployerProfileCardProps {
  profile: Partial<ProfileFormValues>;
}

const EmployerProfileCard = ({ profile }: EmployerProfileCardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pt-5">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
        </div>

        <div className="mb-8">
          <SectionTitle icon={Mail} label="Contact Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 border border-slate-100">
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phone} />
          </div>
        </div>

        <div>
          <SectionTitle icon={Briefcase} label="Work Details" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-100 bg-linear-to-br from-blue-50 to-indigo-50 space-y-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Company
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800 truncate">
                  {profile.company || "—"}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-slate-100 bg-linear-to-br from-blue-50 to-indigo-50 space-y-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Job Title
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800 truncate">
                  {profile.jobtitle || "—"}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-slate-100 bg-linear-to-br from-blue-50 to-indigo-50 space-y-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Department
              </p>
              <div className="flex items-center gap-2 pt-1">
                <LayoutGrid className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800 truncate">
                  {profile.department || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileCard;
