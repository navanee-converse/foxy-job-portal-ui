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

export const stats = [
  {
    value: "4M",
    label: "4 million daily active users",
  },
  {
    value: "12k",
    label: "Over 12k open job positions",
  },
  {
    value: "20M",
    label: "Over 20 million stories shared",
  },
];

export const articles = [
  {
    id: 1,
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "Attract Sales And Profits",
    description:
      "A job ravenously while Far much that one rank beheld after outside....",
    image: "/articles/article-1.webp",
  },
  {
    id: 2,
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "5 Tips For Your Job Interviews",
    description:
      "A job ravenously while Far much that one rank beheld after outside....",
    image: "/articles/article-2.webp",
  },
  {
    id: 3,
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "Overworked Newspaper Editor",
    description:
      "A job ravenously while Far much that one rank beheld after outside....",
    image: "/articles/article-3.webp",
  },
];