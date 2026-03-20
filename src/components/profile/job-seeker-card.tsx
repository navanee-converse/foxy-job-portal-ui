import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Tag,
  FileText,
  Calendar,
  ExternalLink,
} from "lucide-react";
import type { ProfileFormValues } from "@/types/user-profile";
import type { Tag as TagType } from "@/types/tag";
import type { Education, Experience } from "@/types/job-seeker-profile";

export const SectionTitle = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-blue-600" />
    <span className="text-xs font-semibold tracking-widest uppercase text-content-body">
      {label}
    </span>
  </div>
);

export const InfoRow = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
  ) : null;

export const SkillBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-indigo-100">
    {label}
  </span>
);

export const TimelineItem = ({
  title,
  subtitle,
  period,
  institution,
  fieldOfStudy,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  period?: string;
  institution?: string;
  fieldOfStudy?: string | null;
  icon: React.ElementType;
}) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-300  flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div className="w-px flex-1 bg-indigo-100 mt-2" />
    </div>
    <div className="pb-6 flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {subtitle && (
            <p className="text-xs text-blue-600 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {period && (
          <span className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {period}
          </span>
        )}
      </div>
      {fieldOfStudy && (
        <p className="text-xs text-content-body mt-1 leading-relaxed">
          {fieldOfStudy}
        </p>
      )}
      {institution && (
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {institution}
        </p>
      )}
    </div>
  </div>
);

export const Avatar = ({
  name,
  size = "lg",
}: {
  name?: string;
  size?: "sm" | "lg";
}) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const sizeClass = size === "lg" ? "w-20 h-20 text-2xl" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-lg bg-linear-to-tr from-brand-primary via-brand-hover to-brand-btn-hover flex items-center justify-center text-white font-bold shadow-lg shadow-brand-light select-none`}
    >
      {initials}
    </div>
  );
};

interface JobSeekerProfileCardProps {
  profile: Partial<ProfileFormValues>;
  resumeUrl?: string;
}

const JobSeekerProfileCard = ({
  profile,
  resumeUrl,
}: JobSeekerProfileCardProps) => {
  const docUrl = import.meta.env.VITE_DOC_VIEW_URL;
  const tags = (profile.tagIds ?? []) as TagType[];
  const experience = profile.experience ?? [];
  const education = profile.education ?? [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="h-26 rounded-t-lg bg-brand-primary relative overflow-hidden"></div>

      <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm px-8 pb-8">
        <div className="flex items-end justify-between -mt-10 mb-6">
          <div className="z-40 ring-4 ring-white rounded-lg">
            <Avatar name={profile.name} size="lg" />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {profile.name || "—"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-evenly gap-6 p-4 rounded-lg bg-slate-50 border border-slate-100 mb-8">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.company && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{profile.company}</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mb-8">
            <SectionTitle icon={Tag} label="Skills" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <SkillBadge key={tag._id} label={tag.name} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experience.length > 0 && (
            <div>
              <SectionTitle icon={Briefcase} label="Experience" />
              <div>
                {experience.map((exp: Experience, i: number) => (
                  <TimelineItem
                    key={i}
                    icon={Briefcase}
                    title={exp.title || "Role"}
                    subtitle={exp.company}
                    period={
                      exp.startYear
                        ? `${exp.startYear} – ${exp.endYear || "Present"}`
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionTitle icon={GraduationCap} label="Education" />
              <div>
                {education.map((edu: Education, i: number) => (
                  <TimelineItem
                    key={i}
                    icon={GraduationCap}
                    title={edu.level}
                    subtitle={edu.degree}
                    period={
                      edu.startYear?.toString() +
                      " ─ " +
                      edu.endYear?.toString()
                    }
                    fieldOfStudy={edu.fieldOfStudy}
                    institution={edu.institution}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {resumeUrl && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <SectionTitle icon={FileText} label="Resume" />
            <a
              href={docUrl + encodeURIComponent(resumeUrl)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 p-4 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors group w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold  ">View Resume</p>
                <p className="text-xs text-blue-400 truncate">{resumeUrl}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfileCard;
