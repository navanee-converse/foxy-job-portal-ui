import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
import { motion } from "framer-motion";
const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "For Candidates",
      links: [
        "Browse Jobs",
        "Candidate Dashboard",
        "Job Alerts",
        "My Bookmarks",
      ],
    },
    {
      title: "For Employers",
      links: [
        "Browse Candidates",
        "Employer Dashboard",
        "Add Job",
        "Job Packages",
      ],
    },
    {
      title: "About Us",
      links: ["About Us", "Job Page Invoice", "Terms Page", "Blog", "Contact"],
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
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-325 mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount:0.3 }}
            variants={containerVariants}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Hirely" className="w-10 h-10" />
              <span className="text-2xl font-bold text-slate-900">Hirely</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-slate-900 font-semibold">Call us</p>
              <p className="text-blue-600 text-xl font-medium hover:scale-105 transition-transform origin-left cursor-pointer">
                123 456 7890
              </p>
              <p className="text-slate-500 text-sm leading-loose">
                329 Queensberry Street, North Melbourne VIC 3051, Australia.
                <br />
                support@hirely.com
              </p>
            </div>
          </motion.div>

          {footerLinks.map((group) => (
            <motion.div
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="flex flex-col gap-2"
            >
              <h4 className="text-lg font-semibold text-slate-900">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <motion.li key={link} variants={itemVariants}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-blue-600 hover:translate-x-2 transition-all duration-300 inline-block"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200">
        <div className="max-w-325 mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2026 <span className="text-blue-600 font-medium">Hirely</span>.
            All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            {[
              { icon: <RiFacebookFill />, key: "fb" },
              { icon: <FaTwitter />, key: "tw" },
              { icon: <FaInstagram />, key: "ig" },
              { icon: <FaLinkedinIn />, key: "li" },
            ].map((item) => (
              <motion.a
                key={item.key}
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-header-bg flex items-center justify-center rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
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
