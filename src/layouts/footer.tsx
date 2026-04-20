import { useEffect, useRef } from "react";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
// import { useLocation } from "react-router-dom";
// import { getDecodedToken } from "@/utils/auth";
// import { useEffect, useState } from "react";

// const fbUrl = import.meta.env.VITE_FB_URL;
// const xUrl = import.meta.env.VITE_X_URL;
// const linkedInUrl = import.meta.env.VITE_LINKEDIN_URL;
// const instaUrl = import.meta.env.VITE_INSTAGRAM_URL;

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const section = footerRef.current;
    if (!section) return;

    const items = section.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("show");
            }, i * 120);
          }
        });
      },
      { threshold: 0.1 },
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  // const location = useLocation();
  // const [payload, setPayload] = useState(getDecodedToken());

  // useEffect(() => {
  //   setPayload(getDecodedToken());
  // }, [location]);
  // const footerLinks = [
  //   {
  //     title: "For Candidates",
  //     links: [
  //       { name: "Browse Jobs", path: "/jobs" },
  //       { name: "Candidate", path: "/users/profile" },
  //       { name: "Job Alerts", path: "/jobs/alert" },
  //       { name: "My Bookmarks", path: "/jobs/saved" },
  //     ],
  //     role: "job_seeker",
  //   },
  //   {
  //     title: "For Employers",
  //     links: [
  //       { name: "Company", path: "/company" },
  //       { name: "Employer", path: "/users/profile" },
  //       { name: "Add Job", path: "/post-job" },
  //       { name: "Posted Jobs", path: "/jobs" },
  //     ],
  //     role: "employer",
  //   },
  //   {
  //     title: "About Us",
  //     links: [
  //       { name: "About Us", path: "/about" },
  //       { name: "Terms Page", path: "/terms" },
  //       { name: "Blog", path: "/blog" },
  //       { name: "Contact", path: "/contact" },
  //     ],
  //   },
  // ];

  // const containerVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 1.2,
  //       ease: [0.22, 1, 0.36, 1] as const,
  //       staggerChildren: 0.2,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, x: -10 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { duration: 0.5 },
  //   },
  // };

  return (
    // <footer className="w-full bg-white">
    //   <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 gap-12 md:py-6 flex flex-col lg:gap-3">
    //     <div
    //       className={`grid grid-cols-1 sm:grid-cols-2 gap-12 ${payload ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
    //     >
    //       <motion.div
    //         initial="hidden"
    //         whileInView="visible"
    //         viewport={{ once: true, amount: 0.2 }}
    //         variants={containerVariants}
    //         className="flex flex-col gap-6"
    //       >
    //         <div className="flex items-center gap-3">
    //           <img
    //             src="/logo.png"
    //             alt="FoxyJob"
    //             className="w-10 h-10 object-contain"
    //           />
    //           <span className="text-2xl font-bold text-slate-900 tracking-tight">
    //             FoxyJob
    //           </span>
    //         </div>
    //         <div className="flex flex-col gap-2">
    //           <p className="text-slate-900 font-semibold">Call us</p>
    //           <p className="text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors cursor-pointer">
    //             123 456 7890
    //           </p>
    //           <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
    //             329 Anna Street, Erode, Tamil Nadu 638001, India.
    //             <br />
    //             <span className="text-slate-900 font-medium">
    //               support@foxyjob.com
    //             </span>
    //           </p>
    //         </div>
    //       </motion.div>

    //       {footerLinks.map((group) => {
    //         return (
    //           (payload?.role === group.role || !group.role) && (
    //             <motion.div
    //               key={group.title}
    //               initial="hidden"
    //               whileInView="visible"
    //               viewport={{ once: true }}
    //               className="flex flex-col gap-5 items-start lg:items-center text-left lg:text-left"
    //             >
    //               <h4 className="text-lg font-bold text-slate-900">
    //                 {group.title}
    //               </h4>
    //               <ul className="flex flex-col gap-3">
    //                 {group.links.map((link) => (
    //                   <motion.li key={link.name} variants={itemVariants}>
    //                     <Link
    //                       to={link.path}
    //                       className="text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all duration-300 inline-block text-[15px]"
    //                     >
    //                       {link.name}
    //                     </Link>
    //                   </motion.li>
    //                 ))}
    //               </ul>
    //             </motion.div>
    //           )
    //         );
    //       })}
    //     </div>
    //     <div className="max-w-7xl flex flex-col md:flex-row justify-start sm:items-start md:justify-start md:items-center gap-6">
    //       <div className="flex items-center gap-3">
    //         {[
    //           {
    //             icon: <RiFacebookFill />,
    //             key: "fb",
    //             url: fbUrl,
    //           },
    //           {
    //             icon: <FaXTwitter />,
    //             key: "tw",
    //             url: xUrl,
    //           },
    //           {
    //             icon: <FaInstagram />,
    //             key: "ig",
    //             url: instaUrl,
    //           },
    //           {
    //             icon: <FaLinkedinIn />,
    //             key: "li",
    //             url: linkedInUrl,
    //           },
    //         ].map((item) => (
    //           <motion.a
    //             key={item.key}
    //             href={item.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             whileHover={{
    //               y: -4,
    //               backgroundColor: "rgb(37 99 235)",
    //               color: "#fff",
    //             }}
    //             whileTap={{ scale: 0.95 }}
    //             className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded-xl text-slate-600 transition-colors shadow-sm cursor-pointer"
    //           >
    //             <span className="text-lg">{item.icon}</span>
    //           </motion.a>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </footer>

    <footer ref={footerRef} className="text-content-body">
      <div
        className="fade-up px-5 md:pt-11.25 md:px-3.75 lg:flex justify-between lg:px-3.75 lg:pt-12.5
      xl:px-7.5 xl:pb-13.75 2xl:px-78.75 3xl:px-[640px]!"
      >
        <div className="lg:w-53.75">
          <div className="flex items-center gap-3">
            <img src="/superio.svg" alt="" className="cursor-pointer" />
          </div>

          <div className="pt-6.75">
            <p className="text-[18px] text-black font-medium">Call us</p>
            <p className="text-brand-primary font-medium text-lg cursor-pointer text-[18px]">
              123 456 7890
            </p>
          </div>
          <div className="pt-5 pb-12.5 3xl:leading-7.5!">
            <p
              className="text-[16px] leading-6.75 lg:w-70 xl:text-[14px] xl:leading-7.5
            2xl:w-70 3xl:leading-7.5!"
            >
              329 Queensberry Street, North Melbourne VIC{" "}
              <span className="block"> 3051, Australia.</span>
            </p>

            <p className="text-[16px] cursor-pointer   xl:text-[14px] xl:pt-1.5 3xl:pt-0!">
              support@superio.com
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-15.75 gap-x-6
        pb-15 lg:gap-10 lg:pl-60 lg:w-190 xl:w-300 xl:pl-60 2xl:gap-9
        2xl:pl-58.75"
        >
          <div>
            <h4 className="text-[18px] text-gray-800 font-medium pb-7.5">
              For Candidates
            </h4>
            <ul className="space-y-3.5 text-[14px] ">
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Browse Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Candidate Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Job Alerts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  My Bookmarks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[18px] text-gray-800 font-medium pb-7.5">
              For Employers
            </h4>
            <ul className="space-y-3.5 text-[14px] ">
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Browse Candidates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Employer Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Add Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Job Packages
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[18px] text-gray-800 font-medium pb-7.5">
              About Us
            </h4>
            <ul className="space-y-3.5 text-[14px] ">
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Job Page Invoice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Terms Page
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[18px] text-gray-800 font-medium pb-7.5">
              Helpful Resources
            </h4>
            <ul className="space-y-3.5 text-[14px] ">
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Site Map
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Privacy Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Security Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary footer-link">
                  Accessibility Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <hr className="border-gray-200 pt-0.5" /> */}

      <div
        className="px-5 border-t border-gray-200 py-9 w-full flex flex-col md:flex-row-reverse justify-between items-center text-sm md:px-3.75
      lg:px-7.5 2xl:px-78.75 3xl:px-160!"
      >
        <div className="flex gap-9 h-9.75 pt-0.5 md:pt-3.75 md:gap-8.25">
          <a href="#">
            <RiFacebookFill className="w-3.75 h-3.75 hover:text-[#bb86fc]" />
          </a>
          <a href="#">
            <FaTwitter className="hover:text-[#bb86fc]" />
          </a>
          <a href="#">
            <FaInstagram className="hover:text-[#bb86fc]" />
          </a>
          <a href="#">
            <FaLinkedinIn className="hover:text-[#bb86fc]" />
          </a>
        </div>
        <p className="text-center leading-6.75">
          © 2023 Superio by{" "}
          <span className="cursor-pointer hover:underline hover:text-brand-primary">
            ib-themes.
          </span>{" "}
          All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
