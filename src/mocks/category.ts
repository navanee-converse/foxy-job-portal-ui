import type { IconType } from "react-icons";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineCampaign,
  MdOutlineBrush,
  MdOutlineCode,
  MdOutlinePeopleAlt,
  MdOutlineDirectionsCar,
  MdOutlineHeadsetMic,
  MdOutlineHealthAndSafety,
  MdOutlineAssignment,
} from "react-icons/md";

export interface JobCategory {
  id: number;
  name: string;
  icon: IconType;
  openPositions: number;
}

export const jobCategories: JobCategory[] = [
  {
    id: 1,
    name: "Accounting / Finance",
    icon: MdOutlineAccountBalanceWallet,
    openPositions: 2,
  },
  {
    id: 2,
    name: "Marketing",
    icon: MdOutlineCampaign,
    openPositions: 86,
  },
  {
    id: 3,
    name: "Design",
    icon: MdOutlineBrush,
    openPositions: 43,
  },
  {
    id: 4,
    name: "Development",
    icon: MdOutlineCode,
    openPositions: 12,
  },
  {
    id: 5,
    name: "Human Resource",
    icon: MdOutlinePeopleAlt,
    openPositions: 55,
  },
  {
    id: 6,
    name: "Automotive Jobs",
    icon: MdOutlineDirectionsCar,
    openPositions: 2,
  },
  {
    id: 7,
    name: "Customer Service",
    icon: MdOutlineHeadsetMic,
    openPositions: 2,
  },
  {
    id: 8,
    name: "Health and Care",
    icon: MdOutlineHealthAndSafety,
    openPositions: 2,
  },
  {
    id: 9,
    name: "Project Management",
    icon: MdOutlineAssignment,
    openPositions: 92,
  },
];
