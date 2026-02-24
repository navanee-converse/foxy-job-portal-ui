import { FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";

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
      links: ["Abo  ut Us", "Job Page Invoice", "Terms Page", "Blog", "Contact"],
    },
  ];

  return (
    <footer className="w-full bg-white border border-t border-gray-200">
      <div className="max-w-325 mx-auto px-6 md:px-12 p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Hirely" className="w-10 h-10" />
              <span className="text-2xl font-bold text-content-heading">
                Hirely
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-content-heading font-semibold">Call us</p>
              <p className="text-brand-primary text-xl font-medium">
                123 456 7890
              </p>
              <p className="text-content-body text-sm leading-loose">
                329 Queensberry Street, North Melbourne VIC 3051, Australia.
                <br />
                support@hirely.com
              </p>
            </div>
          </div>

          {/* Map through Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col gap-6">
              <h4 className="text-lg font-semibold text-content-heading">
                {group.title}
              </h4>
              <ul className="flex flex-col text-content-body text-sm gap-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-content-body hover:text-brand-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200">
        <div className="max-w-325 mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-content-body text-sm text-center md:text-left">
            © 2026{" "}
            <span className="text-brand-primary font-medium">Hirely</span>. All
            Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            {[
              <RiFacebookFill key="fb" />,
              <FaTwitter key="tw" />,
              <FaInstagram key="ig" />,
              <FaLinkedinIn key="li" />,
            ].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="group w-10 h-10 bg-white flex items-center justify-center rounded-lg transition-all"
              >
                <span className="text-content-body group-hover:text-brand-primary transition-all text-lg">
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
