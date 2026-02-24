import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FaHome, FaSearch, FaBuilding, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
      if (window.scrollY > 20) {
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
    { name: "Find Jobs", icon: <FaSearch />, path: "/jobs" },
    { name: "Employers", icon: <FaBuilding />, path: "/employers" },
    { name: "Candidates", icon: <FaUser />, path: "/candidates" },
  ];

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-1000 border-b ease-in-out border-gray-100 shadow-md shadow-gray-200/10
        ${isScrolled ? "bg-white" : `${bgColor}`}`}
    >
      <div className="max-w-wide mx-auto w-full flex items-center justify-between p-5 px-6 md:px-12 lg:px-20">
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
          <button
            className="hidden lg:block bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-btn-hover transition-all shadow-md"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login / Register
          </button>

          <button
            className="lg:hidden text-3xl text-content-heading"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
