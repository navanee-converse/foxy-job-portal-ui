import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function HomeSidebar({ open, setOpen }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* 🔳 Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* 📱 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-lg font-semibold">Superio</span>
          </div>

          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Menu Items */}
        <ul className="p-4 space-y-6 text-[16px] pt-6">
          {[
            "Home",
            "Job Listing",
            "Job Single",
            "Employers List",
            "Employers Single",
            "Candidates List",
            "Candidates Single",
            "Blog",
            "Pages",
            "Shop",
            "Dashboard",
          ].map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center cursor-pointer hover:text-blue-600"
            >
              {item}
              <ChevronRight className="w-4 h-4 stroke-3" />
            </li>
          ))}
        </ul>

        <div className="p-4 py-6">
          <button className="w-full bg-brand-primary text-white py-4.5 rounded-lg">
            Job Post
          </button>

          <div className="mt-6 pb-7 text-[14px] text-content-body">
            <p className=" font-medium text-[18px]">Call us</p>
            <p className="text-[18px] font-medium text-gray-600">
              123 456 7890
            </p>
            <p className="leading-7.5 pt-4 text-content-body">
              329 Queensberry Street, North Melbourne VIC{" "}
              <span className="block"> 3051, Australia.</span>
            </p>
            <p>support@superio.com</p>
          </div>
          <div className="flex gap-9 h-9.75 pt-0.5 md:pt-3.75 md:gap-8.25">
            <a href="#">
              <RiFacebookFill className="w-3.75 text-content-body h-3.75 hover:text-[#bb86fc]" />
            </a>
            <a href="#">
              <FaTwitter className="text-content-body hover:text-[#bb86fc]" />
            </a>
            <a href="#">
              <FaInstagram className="text-content-body hover:text-[#bb86fc]" />
            </a>
            <a href="#">
              <FaLinkedinIn className="text-content-body hover:text-[#bb86fc]" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
