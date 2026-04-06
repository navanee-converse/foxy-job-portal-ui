import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiFacebookFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { getDecodedToken } from "@/utils/auth";
import { useEffect, useState } from "react";

const fbUrl = import.meta.env.VITE_FB_URL;
const xUrl = import.meta.env.VITE_X_URL;
const linkedInUrl = import.meta.env.VITE_LINKEDIN_URL;
const instaUrl = import.meta.env.VITE_INSTAGRAM_URL;

const Footer: React.FC = () => {
  const location = useLocation();
  const [payload, setPayload] = useState(getDecodedToken());

  useEffect(() => {
    setPayload(getDecodedToken());
  }, [location]);
  const footerLinks = [
    {
      title: "For Candidates",
      links: [
        { name: "Browse Jobs", path: "/jobs" },
        { name: "Candidate", path: "/users/profile" },
        { name: "Job Alerts", path: "/jobs/alert" },
        { name: "My Bookmarks", path: "/jobs/saved" },
      ],
      role: "job_seeker",
    },
    {
      title: "For Employers",
      links: [
        { name: "Company", path: "/company" },
        { name: "Employer", path: "/users/profile" },
        { name: "Add Job", path: "/post-job" },
        { name: "Posted Jobs", path: "/jobs" },
      ],
      role: "employer",
    },
    {
      title: "About Us",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Terms Page", path: "/terms" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 gap-12 md:py-6 flex flex-col lg:gap-3">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-12 ${payload ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="FoxyJob"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                FoxyJob
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-slate-900 font-semibold">Call us</p>
              <p className="text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors cursor-pointer">
                123 456 7890
              </p>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                329 Anna Street, Erode, Tamil Nadu 638001, India.
                <br />
                <span className="text-slate-900 font-medium">
                  support@foxyjob.com
                </span>
              </p>
            </div>
          </motion.div>

          {footerLinks.map((group) => {
            return (
              (payload?.role === group.role || !group.role) && (
                <motion.div
                  key={group.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col gap-5 items-start lg:items-center text-left lg:text-left"
                >
                  <h4 className="text-lg font-bold text-slate-900">
                    {group.title}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {group.links.map((link) => (
                      <motion.li key={link.name} variants={itemVariants}>
                        <Link
                          to={link.path}
                          className="text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all duration-300 inline-block text-[15px]"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )
            );
          })}
        </div>
        <div className="max-w-7xl flex flex-col md:flex-row justify-start sm:items-start md:justify-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            {[
              {
                icon: <RiFacebookFill />,
                key: "fb",
                url: fbUrl,
              },
              {
                icon: <FaXTwitter />,
                key: "tw",
                url: xUrl,
              },
              {
                icon: <FaInstagram />,
                key: "ig",
                url: instaUrl,
              },
              {
                icon: <FaLinkedinIn />,
                key: "li",
                url: linkedInUrl,
              },
            ].map((item) => (
              <motion.a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  y: -4,
                  backgroundColor: "rgb(37 99 235)",
                  color: "#fff",
                }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded-xl text-slate-600 transition-colors shadow-sm cursor-pointer"
              >
                <span className="text-lg">{item.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
