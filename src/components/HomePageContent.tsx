import { ImSearch } from "react-icons/im";
import { CiLocationOn } from "react-icons/ci";
import { jobCategories } from "../mocks/category";
import { IoCheckmark } from "react-icons/io5";

const HomePageContent: React.FC = () => {
  const contentWidthClass = "max-w-325 mx-auto px-6 md:px-12";

  return (
    <div className="bg-white pb-25">
      <div className="w-full bg-header-bg md:py-12 lg:py-16 h-auto">
        <div
          className={`${contentWidthClass} flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-20`}
        >
          <div className="flex flex-col gap-6 w-full lg:max-w-175 z-10 lg:pb-16">
            <div className="text-3xl md:text-4xl xl:text-5xl font-medium leading-tight text-content-heading">
              <span className="inline-block lg:whitespace-nowrap">
                There Are <span className="text-brand-primary">93,178</span>{" "}
                Postings Here
              </span>
              <br />
              For you!
            </div>

            <div className="text-content-body text-base md:text-lg">
              Find Jobs, Employment & Career Opportunities
            </div>

            <div className="w-full lg:max-w-218 lg:bg-white lg:shadow-sm rounded-lg overflow-hidden lg:border lg:border-gray-100 lg:p-3 flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
              <div className="flex items-center gap-4 px-6 py-6 flex-[1.6] w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-gray-100 lg:border-none shadow-sm lg:shadow-none">
                <ImSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full outline-none text-base text-content-heading bg-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

              <div className="flex items-center gap-4 px-4 py-6 flex-1 w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-gray-100 lg:border-none shadow-sm lg:shadow-none">
                <CiLocationOn className="text-gray-400 text-2xl" />
                <input
                  type="text"
                  placeholder="City or postcode"
                  className="w-full outline-none text-base text-content-heading bg-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="p-1 lg:pl-2 w-full lg:w-auto">
                <button className="w-full lg:w-40 bg-brand-primary text-white py-5 lg:py-4 px-6 rounded-lg font-medium hover:bg-brand-hover transition-all text-md shadow-md lg:shadow-sm">
                  Find Jobs
                </button>
              </div>
            </div>

            <div className="text-sm text-content-heading">
              <span className="font-semibold mr-2">Popular Searches :</span>
              <span className="text-content-body">
                Designer, Developer, Web, PHP, Engineer
              </span>
            </div>
          </div>

          <div className="hidden lg:flex relative shrink-0">
            <img
              src="home/banner-img.png"
              alt="Banner Hero"
              className="block w-full max-w-lg xl:max-w-xl h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <section className="w-full pt-20 bg-white">
        <div className={contentWidthClass}>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-content-heading mb-3">
              Popular Job Categories
            </h2>
            <p className="text-content-body">
              2026 jobs live - 293 added today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-20 gap-5 justify-items-center">
            {jobCategories.map((cat) => (
              <div
                key={cat.id}
                className="group border bg-header-bg border-gray-100 p-6 rounded-lg flex items-center gap-5 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-brand-primary/20 w-full max-w-95"
              >
                <div className="p-4 bg-gray-100 text-brand-primary rounded-xl transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white shrink-0">
                  <cat.icon size={28} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base md:text-lg font-bold text-content-heading transition-colors duration-300 group-hover:text-brand-primary truncate">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({cat.openPositions} open positions)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full border-t border-gray-200 my-4"></div>

      <section
        className={`${contentWidthClass} py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20`}
      >
        <div className="flex-1 w-full">
          <img
            src="home/work-img.webp"
            alt="Find your job"
            className="w-full h-auto object-cover rounded-lg shadow-sm"
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-4xl md:text-4xl font-semibold text-content-heading leading-tight">
            Millions of Jobs. Find the one that suits you.
          </h2>
          <p className="text-content-body text-base leading-relaxed">
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 600,000 companies worldwide.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {[
              "Bring to the table win-win survival",
              "Capitalize on low hanging fruit to identify",
              "But I must explain to you how all this",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center">
                  <IoCheckmark className="text-brand-primary text-xl" />
                </div>
                <span className="text-content-heading text-base font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button className="bg-brand-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-brand-hover transition-all shadow-lg shadow-brand-primary/10">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="w-full pt-5 -ml-2">
        <div className={contentWidthClass}>
          <div className="relative overflow-hidden bg-brand-light rounded-xl flex flex-row items-center min-h-55 md:min-h-75">
            <div className="flex flex-col gap-4 md:gap-6 z-10 p-6 md:p-12 w-full max-w-[65%] md:max-w-[60%]">
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-xl md:text-3xl font-semibold text-content-heading">
                  {" "}
                  Recruiting?{" "}
                </span>
                <h2 className="text-xs md:text-base tracking-wide text-content-muted leading-relaxed">
                  Advertise your jobs to millions of monthly users and search
                  15.8 million CVs in our database.
                </h2>
              </div>
              <div>
                <button className="bg-brand-primary text-white px-5 md:px-10 py-3 md:py-4 rounded-lg text-s md:text-md font-medium hover:bg-brand-hover transition-all shadow-lg shadow-brand-primary/20 whitespace-nowrap">
                  Start Recruiting Now
                </button>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 h-full w-[35%] md:w-[40%] flex justify-end items-end pointer-events-none">
              <img
                src="home/recruiting.png"
                alt="Recruiting Illustration"
                className="w-auto h-[80%] md:h-full object-contain object-bottom-right"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl opacity-40"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageContent;
