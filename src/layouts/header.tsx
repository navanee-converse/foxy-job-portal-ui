import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { request } from "@/services/api";
import { BsBell } from "react-icons/bs";
import toast from "react-hot-toast";
import { getDecodedToken } from "@/utils/auth";
import type { ApiError } from "@/types/response";
import type { Job } from "@/types/job";

interface HeaderProps {
  bgColor?: string;
}

interface UserMeResponse {
  name: string;
  email: string;
  providers: object[];
}
type UserProfile = Omit<UserMeResponse, "providers">;

const Header: React.FC<HeaderProps> = ({
  bgColor = "bg-white",
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isThirdPartyLogin, setIsThirdPartyLogin] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const accessToken = Cookies.get("access_token");
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const loadingToast = toast.loading("Logging out...");

    try {
      await request("/auth/logout", "POST");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as ApiError;
        toast.error(apiError.message);
      } else toast.error("Error occured");
    } finally {
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      localStorage.clear();

      toast.dismiss(loadingToast);
      toast.success("Successfully logged out");

      setIsMenuOpen(false);
      navigate("/login");
      setIsLoggingOut(false);
    }
  };
  const getJobId = async () => {
    try {
      const res = await request<{ data: Job[] }>("/jobs", "GET");
      return res.data[0]._id;
    } catch (_err) {
      console.warn("Unable to fetch jobs");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    const fetchUser = async () => {
      if (accessToken) {
        try {
          const res = await request<UserMeResponse>("/users/me", "GET");
          if (res.providers.length > 0) {
            setIsThirdPartyLogin(true);
          }
          setUserData({
            name: res.name,
            email: res.email,
          });
        } catch (error) {
          if (error && typeof error === "object" && "message" in error) {
            const apiError = error as ApiError;
            toast.error(apiError.message);
          } else toast.error("Failed to fetch user");
        }
      }
    };

    fetchUser();
    window.addEventListener("profileUpdated", fetchUser);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("profileUpdated", fetchUser);
    };
  }, [accessToken]);
  const payload = getDecodedToken();
  const role = payload?.role;

  const navLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Jobs", icon: <FaSearch />, path: "/jobs" },
    { name: "Applications", icon: <HiDocumentText />, path: "/jobs/applied" },
    { name: "Profile", icon: <FaUser />, path: "/users/profile" },
  ];
  const employerLinks = [
    {
      name: "Post Job",
      path: "/post-job",
    },
    {
      name: "Company Profile",
      path: "/company",
    },
  ];
  const jobSeekerLinks = { name: "Saved Jobs", path: "/jobs/saved" };

  const menuLinks = [
    { name: "Change Password", path: "/change-password" },
    { name: "Logout", path: "/" },
  ];

  const userInitial = userData?.name?.charAt(0).toUpperCase() || "U";

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isScrolled ? [-100, 0] : 0,
        position: isScrolled ? "fixed" : "sticky",
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.98)" : "white",
        boxShadow: isScrolled ? "0 10px 15px -3px rgba(0,0,0,0.1)" : "none",
        paddingTop: isScrolled ? "0px" : "10px",
        paddingBottom: isScrolled ? "0px" : "10px",
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        backgroundColor: { duration: 0.6 },
      }}
      className={`w-full top-0 z-50 border-b border-gray-100 shadow-md shadow-gray-200/10 ${
        !isScrolled ? bgColor : ""
      }`}
    >
      <div className="max-w-wide mx-auto w-full flex items-center justify-between p-3 px-6 md:px-12 lg:px-20">
        <div
          className="flex items-center shrink-0 z-50 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Hirely Logo"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="pl-3 text-xl font-bold text-content-heading">
            Hirely
          </span>
        </div>

        {accessToken && (
          <nav className="hidden lg:flex items-center gap-8 xl:gap-25 font-medium text-content-heading">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="group flex items-center gap-2 hover:text-brand-primary cursor-pointer transition-colors"
                onClick={async () => {
                  if (link.name === "Applications" && role === "employer") {
                    const jobId = await getJobId();
                    navigate(`/jobs/${jobId}/applications`);
                  } else {
                    navigate(link.path);
                  }
                }}
              >
                <span className="text-gray-400 group-hover:text-brand-primary transition-colors">
                  {link.icon}
                </span>
                <span className="pr-2">{link.name}</span>
              </div>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4 z-50">
          {!accessToken ? (
            <button
              className="hidden lg:block bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-btn-hover transition-all shadow-md"
              onClick={() => navigate("/login")}
            >
              Login / Register
            </button>
          ) : (
            <div className="flex gap-8">
              {role === "job_seeker" && (
                <div>
                  <BsBell
                    className="hidden hover:text-brand-primary lg:flex items-center justify-center w-5 h-5 transition-all mt-3 cursor-pointer"
                    onClick={() => navigate("/jobs/alert")}
                  />
                </div>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-white font-bold shadow-sm hover:ring-4 ring-brand-primary/10 transition-all cursor-pointer"
              >
                {userInitial}
              </button>
            </div>
          )}

          <button
            className="lg:hidden text-3xl text-content-heading"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <MdClose />
            ) : accessToken ? (
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold">
                {userInitial}
              </div>
            ) : (
              <MdMenu />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              className="fixed inset-0 z-40 hidden lg:block"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div className="absolute top-full right-6 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex flex-col p-3">
                {accessToken && userData && (
                  <div className="px-4 py-3 mb-2 border-b border-gray-50">
                    <p className="text-sm font-bold text-content-heading">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email}
                    </p>
                  </div>
                )}

                {accessToken && (
                  <div className="lg:hidden flex flex-col">
                    {navLinks.map((link) => {
                      return (
                        <div
                          key={link.name}
                          className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-lg transition-colors cursor-pointer group"
                          onClick={async () => {
                            setIsMenuOpen(false);
                            if (
                              link.name === "Applications" &&
                              role === "employer"
                            ) {
                              const jobId = await getJobId();
                              navigate(`/jobs/${jobId}/applications`);
                            } else {
                              navigate(link.path);
                            }
                          }}
                        >
                          <span className="font-medium text-gray-600 group-hover:text-brand-primary">
                            {link.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex flex-col">
                  {accessToken && (
                    <>
                      {role === "employer" ? (
                        employerLinks.map((link) => (
                          <div
                            key={link.name}
                            className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-lg cursor-pointer group"
                            onClick={() => {
                              navigate(link.path);
                              setIsMenuOpen(false);
                            }}
                          >
                            <span className="font-medium text-gray-600 group-hover:text-brand-primary">
                              {link.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div
                          className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-lg cursor-pointer group"
                          onClick={() => {
                            navigate(jobSeekerLinks.path);
                            setIsMenuOpen(false);
                          }}
                        >
                          <span className="font-medium text-gray-600 group-hover:text-brand-primary">
                            {jobSeekerLinks.name}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {accessToken &&
                    menuLinks.map((link) => {
                      if (link.name !== "Change Password" || !isThirdPartyLogin)
                        return (
                          <div
                            key={link.name}
                            className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-lg cursor-pointer group"
                            onClick={() => {
                              if (link.name === "Logout") handleLogout();
                              else navigate(link.path);
                              setIsMenuOpen(false);
                            }}
                          >
                            <span className="font-medium text-gray-600 group-hover:text-brand-primary">
                              {link.name}
                            </span>
                          </div>
                        );
                    })}
                </div>

                {!accessToken && (
                  <div className="pt-3 mt-2 border-t border-gray-100">
                    <button
                      className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Login / Register
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
