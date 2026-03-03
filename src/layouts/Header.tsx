import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderProps {
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  bgColor = "bg-white",
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Jobs", icon: <FaSearch />, path: "/jobs" },
    { name: "Applications", icon: <HiDocumentText />, path: "/applications" },
    { name: "Profile", icon: <FaUser />, path: "/users/profile" },
  ];
  const menuLinks = [
    { name: " Job Alert", path: "/jobs/alert" },
    {
      name: "Applied Jobs",
      path: "/jobs/applied",
    },
    {
      name: "Saved Jobs",
      path: "/jobs/saved",
    },
  ];
  const accessToken = Cookies.get("access_token");

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
        <div className="flex items-center shrink-0 z-50">
          <img
            src="/logo.png"
            alt="Hirely Logo"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="pl-3 text-xl font-bold text-content-heading">
            Hirely
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 xl:gap-25 font-medium text-content-heading">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="group flex items-center gap-2 hover:text-brand-primary cursor-pointer transition-colors"
            >
              <span className="text-gray-400 group-hover:text-brand-primary transition-colors">
                {link.icon}
              </span>
              <span>{link.name}</span>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2 z-50">
          {!accessToken && (
            <button
              className="hidden lg:block bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-btn-hover transition-all shadow-md"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login / Register
            </button>
          )}

          <button
            className="lg:hidden text-3xl text-content-heading"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose /> : <MdMenu />}
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

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-6 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 lg:hidden z-50 overflow-hidden"
            >
              <div className="flex flex-col p-3">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <div
                      key={link.name}
                      className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-xl transition-colors cursor-pointer group"
                      onClick={() => {
                        navigate(link.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className="text-gray-400 group-hover:text-brand-primary transition-colors">
                        {link.icon}
                      </span>
                      <span className="font-semibold text-content-heading group-hover:text-brand-primary transition-colors">
                        {link.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
                  <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Management
                  </p>
                  {menuLinks.map((link) => (
                    <div
                      key={link.name}
                      className="flex items-center gap-4 py-3 px-4 hover:bg-brand-primary/5 rounded-xl transition-colors cursor-pointer group"
                      onClick={() => {
                        navigate(link.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className="font-medium text-gray-600 group-hover:text-brand-primary transition-colors">
                        {link.name}
                      </span>
                    </div>
                  ))}
                </div>

                {!accessToken && (
                  <div className="pt-3 mt-2 border-t border-gray-100">
                    <button
                      className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition-all"
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
