import { useEffect, useState } from "react";
// import { FaHome, FaSearch, FaUser } from "react-icons/fa";
// import { HiDocumentText } from "react-icons/hi2";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import { motion } from "framer-motion";
// import { request } from "@/services/api";
import { ChevronDown } from "lucide-react";
// import toast from "react-hot-toast";
// import { getDecodedToken } from "@/utils/auth";
// import type { ApiError } from "@/types/response";
// import type { Job } from "@/types/job";
import HomeSidebar from "@/components/homepage/sidebar";
import { CgCloseO } from "react-icons/cg";

interface HeaderProps {
  bgColor?: string;
}

// interface UserMeResponse {
//   name: string;
//   email: string;
//   providers: object[];
// }
// type UserProfile = Omit<UserMeResponse, "providers">;

const Header: React.FC<HeaderProps> = ({}: HeaderProps) => {
  // const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [isThirdPartyLogin, setIsThirdPartyLogin] = useState(false);
  // const [userData, setUserData] = useState<UserProfile | null>(null);
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  // const accessToken = Cookies.get("access_token");
  // const handleLogout = async () => {
  //   if (isLoggingOut) return;
  //   setIsLoggingOut(true);
  //   const loadingToast = toast.loading("Logging out...");

  //   try {
  //     await request("/auth/logout", "POST");
  //   } catch (error) {
  //     if (error && typeof error === "object" && "message" in error) {
  //       const apiError = error as ApiError;
  //       console.error(apiError.message);
  //     } else toast.error("Error occured");
  //   } finally {
  //     Cookies.remove("access_token", { path: "/" });
  //     Cookies.remove("refresh_token", { path: "/" });
  //     localStorage.clear();

  //     toast.dismiss(loadingToast);
  //     toast.success("Successfully logged out");

  //     setIsMenuOpen(false);
  //     navigate("/login");
  //     setIsLoggingOut(false);
  //   }
  // };
  // const getJobId = async () => {
  //   try {
  //     const res = await request<{ data: Job[] }>("/jobs", "GET");
  //     return res.data[0]._id;
  //   } catch (_err) {
  //     console.warn("Unable to fetch jobs");
  //   }
  // };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 150);
  //   };

  //   const fetchUser = async () => {
  //     if (accessToken) {
  //       try {
  //         const res = await request<UserMeResponse>("/users/me", "GET");
  //         if (res.providers.length > 0) {
  //           setIsThirdPartyLogin(true);
  //         }
  //         setUserData({
  //           name: res.name,
  //           email: res.email,
  //         });
  //       } catch (error) {
  //         if (error && typeof error === "object" && "message" in error) {
  //           const apiError = error as ApiError;
  //           console.error(apiError.message);
  //         } else toast.error("Failed to fetch user");
  //       }
  //     }
  //   };

  //   fetchUser();
  //   window.addEventListener("profileUpdated", fetchUser);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("profileUpdated", fetchUser);
  //   };
  // }, [accessToken]);
  // const payload = getDecodedToken();
  // const role = payload?.role;

  // const navLinks = [
  //   { name: "Home", icon: <FaHome />, path: "/" },
  //   { name: "Jobs", icon: <FaSearch />, path: "/jobs" },
  //   { name: "Applications", icon: <HiDocumentText />, path: "/jobs/applied" },
  //   { name: "Profile", icon: <FaUser />, path: "/users/profile" },
  // ];
  // const employerLinks = [
  //   {
  //     name: "Post Job",
  //     path: "/post-job",
  //   },
  //   {
  //     name: "Company Profile",
  //     path: "/company",
  //   },
  // ];
  // const jobSeekerLinks = { name: "Saved Jobs", path: "/jobs/saved" };

  // const menuLinks = [
  //   { name: "Change Password", path: "/change-password" },
  //   { name: "Logout", path: "/" },
  // ];

  // const userInitial = userData?.name?.charAt(0).toUpperCase() || "U";

  return (
    <motion.header
      initial={{ y: 0 }}
      // animate={{
      //   y: isScrolled ? [-100, 0] : 0,
      //   position: isScrolled ? "fixed" : "sticky",
      //   backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "white",
      //   boxShadow: isScrolled ? "0 10px 15px -3px rgba(0,0,0,0.1)" : "none",
      // }}
      // transition={{
      //   duration: 0.8,
      //   ease: [0.22, 1, 0.36, 1],
      //   backgroundColor: { duration: 0.6 },
      // }}
      // className={`w-full top-0 z-50 border-b border-gray-100 shadow-md shadow-gray-200/10 ${
      //   !isScrolled ? bgColor : ""
      // }`}
    >
      <div
        className={`fixed top-0 left-0 items-center w-full z-99 h-fit bg-white xl:bg-header-bg xl:gap-35 text-[15px]
      xl:flex xl:py-3.5 3xl:flex! 3xl:justify-around! 3xl:pl-41.25! 3xl:py-3.5! transition-all duration-200 ${
        isScrolled
          ? "fixed bg-white shadow-md shadow-gray-200/60 xl:py-3.5 xl:bg-white"
          : "absolute bg-transparent xl:py-5 xl:pt-6"
      }`}
      >
        <div className="flex pl-6.25 justify-between p-1 pb-1.5 pr-2 md:pl-5 md:pr-0.5 items-center xl:hidden shadow-[0_6px_15px_rgba(64,79,104,0.05)]">
          <img
            src="/superio.svg"
            alt="superio"
            className="h-10 xl:h-15 xl:w-10 m-2.5 cursor-pointer"
          />
          {!isMenuOpen && (
            <div className="flex justify-between mr-3 w-15.75 lg:mr-3">
              <img src="/header/user.svg" className="cursor-pointer" />
              <img
                src="/header/menu.svg"
                alt=""
                className="w-6.5 h-6.5 cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              />
            </div>
          )}
          {isMenuOpen && (
            <div>
              <CgCloseO
                className="w-6.5 h-6.5"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:max-w-5xl xl:flex items-start pl-14.5 2xl:pl-15 2xl:max-w-384 3xl:ml-38 3xl:pl-12.5!">
          <img
            src="/superio.svg"
            alt="superio"
            className="h-10 xl:w-38 xl:h-13 cursor-pointer"
          />

          <div className="flex gap-7.5 mt-3.5 ml-15 xl:pl-1 xl:gap-7.25 2xl:ml-24 2xl:gap-8.5 3xl:gap-7.5!">
            <div className=" flex 3xl:ml-1">
              <a href="#">Home</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>

            <div className="flex 3xl:ml-1 whitespace-nowrap">
              <a href="#">Find Jobs</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>
            <div className=" flex 3xl:ml-1">
              <a href="#">Employers</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>
            <div className=" flex 3xl:ml-1">
              <a href="#">Candidates</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>
            <div className=" flex 3xl:ml-1">
              <a href="#">Blog</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>
            <div className=" flex 3xl:ml-1">
              <a href="#">Pages</a>
              <ChevronDown className="m-1.5 mt-1 w-3 h-3 stroke-5" />
            </div>
          </div>
        </div>
        <div
          className="hidden mr-6 xl:flex items-start mt-0 gap-5.5 text-sm xl:w-125 
        xl:pl-3.75 xl:gap-5 2xl:w-250 2xl:mt-0 2xl:pl-109 3xl:mr-32 3xl:text-[15px]! 3xl:pl-77!"
        >
          <div className="mt-2 xl:text-[15px] 2xl:mt-4 3xl:mt-5 text-brand-primary cursor-pointer">
            Upload your CV
          </div>
          <div
            className="bg-button-lite text-brand-primary px-5 py-2 rounded-md 2xl:px-9 2xl:py-4 2xl:text-[15px] 3xl:py-5 cursor-pointer
          hover:bg-brand-btn-hover hover:text-white transition-colors duration-500"
          >
            Login / Register
          </div>
          <div
            className=" bg-brand-primary text-white px-7 py-2 rounded-md 2xl:px-11 2xl:text-[15px] 2xl:py-4 3xl:py-5 cursor-pointer
          hover:bg-brand-btn-hover transition-colors duration-500"
          >
            Job Post
          </div>
        </div>
      </div>

      <HomeSidebar open={isMenuOpen} setOpen={setIsMenuOpen} />
    </motion.header>
  );
};

export default Header;
