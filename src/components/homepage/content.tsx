import { ImSearch } from "react-icons/im";
import { CiLocationOn } from "react-icons/ci";
import * as HiIcons from "react-icons/hi";
import * as FiIcons from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { request } from "@/services/api";
import type { PopularSearches } from "@/types/popular-searches";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestion";
import type { Category, Job } from "@/types/job";
import useDebounce from "@/hooks/useDebounce";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { getDecodedToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { highlightMatch } from "@/utils/highlight-match";

const HomePageContent: React.FC = () => {
  const contentWidthClass = "max-w-325 mx-auto px-6 md:px-12";
  const navigate = useNavigate();
  const [cityValue, setCityValue] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citySelectedIndex, setCitySelectedIndex] = useState(-1);
  const cityContainerRef = useRef<HTMLDivElement>(null);
  const debouncedCity = useDebounce(cityValue, 800);
  const [jobCategories, setJobCategories] = useState<Category[]>([]);
  const titleSearch = useSearchSuggestions<Job>(
    "/jobs?limit=5&title=",
    (job) => job.title,
  );

  const [count, setCount] = useState(0);
  const [popularSearches, setPopularSearches] = useState<{ term: string }[]>(
    [],
  );

  const Icons: Record<string, IconType> = {
    ...HiIcons,
    ...FiIcons,
    ...MdIcons,
  };
  const payload = getDecodedToken();
  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedCity.length >= 1) {
        try {
          const res = await request<string[]>(
            `/companies/cities?search=${encodeURIComponent(debouncedCity)}`,
            "GET",
          );
          const data = res;
          setCitySuggestions(Array.from(new Set(data)));
          setShowCitySuggestions(data.length > 0);
          console.log("response,", res);
        } catch (err) {
          console.error("City fetch error:", err);
          setCitySuggestions([]);
        }
      } else {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
      }
    };

    fetchCities();
  }, [debouncedCity]);

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (citySuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next =
        citySelectedIndex === citySuggestions.length - 1
          ? 0
          : citySelectedIndex + 1;
      setCitySelectedIndex(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        citySelectedIndex <= 0
          ? citySuggestions.length - 1
          : citySelectedIndex - 1;
      setCitySelectedIndex(next);
    } else if (e.key === "Enter" && citySelectedIndex >= 0) {
      setCityValue(citySuggestions[citySelectedIndex]);
      setShowCitySuggestions(false);
    } else if (e.key === "Escape") {
      setShowCitySuggestions(false);
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [searchRes, countRes, categoryRes] = await Promise.all([
          request<PopularSearches[]>("/searches/popular", "GET"),
          request<{ totalActiveJobs: number }>("/jobs/count", "GET"),
          request<Category[]>("/categories/stats", "GET"),
        ]);
        setPopularSearches(searchRes);
        setCount(countRes.totalActiveJobs);
        setJobCategories(categoryRes);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitialData();
  }, []);

  const handlePopularClick = (term: string) => {
    titleSearch.setValue(term);
    titleSearch.prevValue.current = term;
    navigate(`/jobs?title=${encodeURIComponent(term)}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (titleSearch.value) params.append("title", titleSearch.value);
    navigate(`/jobs?${params.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        titleSearch.containerRef.current &&
        !titleSearch.containerRef.current.contains(target)
      ) {
        titleSearch.setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [titleSearch]);

  return (
    <div className="bg-white pb-25">
      <div className="w-full bg-header-bg md:py-12 lg:py-16 lg:h-215 md:h-200">
        <div
          className={`${contentWidthClass} flex flex-col lg:flex-row items-center lg:items-end lg:justify-evenly gap-12 lg:gap-20`}
        >
          <div className="flex flex-col gap-8 w-full lg:max-w-175 z-10 lg:pb-30 md:pb-20">
            <div className="text-3xl md:text-4xl xl:text-5xl font-medium leading-tight text-content-heading">
              <span className="inline-block lg:whitespace-nowrap">
                There Are <span className="text-brand-primary">{count}</span>{" "}
                Postings Here
              </span>
              <br /> For you!
            </div>

            <div className="text-content-body text-base md:text-lg">
              Find Jobs, Employment & Career Opportunities
            </div>

            <div className="w-full lg:max-w-218 lg:bg-white lg:shadow-sm rounded-lg lg:border lg:border-gray-100 lg:p-3 flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
              <div
                className="relative flex-[1.6] w-full"
                ref={titleSearch.containerRef}
              >
                <div className="flex items-center gap-4 px-6 py-6 w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-gray-100 lg:border-none shadow-sm lg:shadow-none">
                  <ImSearch className="text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={titleSearch.value}
                    onChange={(e) => {
                      titleSearch.setValue(e.target.value);
                      titleSearch.prevValue.current = e.target.value;
                    }}
                    onKeyDown={titleSearch.handleKeyDown}
                    onFocus={() =>
                      titleSearch.value.length > 1 &&
                      titleSearch.setShowSuggestions(true)
                    }
                    className="w-full outline-none text-base text-content-heading bg-transparent placeholder:text-gray-400"
                  />
                </div>

                {titleSearch.showSuggestions &&
                  titleSearch.suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-2 rounded-lg shadow-2xl z-999 max-h-60 overflow-y-auto">
                      {titleSearch.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`px-6 py-3 cursor-pointer text-content-heading transition-colors border-b last:border-none border-gray-50 
                        ${titleSearch.selectedIndex === index ? "bg-brand-light text-brand-primary" : "hover:bg-brand-light"}`}
                          onClick={() => {
                            titleSearch.setValue(suggestion);
                            titleSearch.setShowSuggestions(false);
                          }}
                        >
                          {highlightMatch(suggestion, titleSearch.value)}{" "}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

              <div className="relative flex-1 w-full" ref={cityContainerRef}>
                <div className="flex items-center gap-4 px-4 py-6 w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-gray-100 lg:border-none shadow-sm lg:shadow-none">
                  <CiLocationOn className="text-gray-400 text-2xl" />
                  <input
                    type="text"
                    placeholder="City"
                    value={cityValue}
                    onChange={(e) => setCityValue(e.target.value)}
                    onKeyDown={handleCityKeyDown}
                    onFocus={() =>
                      cityValue.length >= 1 && setShowCitySuggestions(true)
                    }
                    className="w-full outline-none text-base text-content-heading bg-transparent placeholder:text-gray-400"
                  />
                </div>

                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-2 rounded-lg shadow-2xl z-999 max-h-60 overflow-y-auto">
                    {citySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`px-6 py-3 cursor-pointer text-content-heading transition-colors border-b last:border-none border-gray-50 
                          ${citySelectedIndex === index ? "bg-brand-light text-brand-primary" : "hover:bg-brand-light"}`}
                        onClick={() => {
                          setCityValue(suggestion);
                          setShowCitySuggestions(false);
                        }}
                      >
                        {highlightMatch(suggestion, cityValue)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-1 lg:pl-2 w-full lg:w-auto">
                <button
                  className="w-full lg:w-40 cursor-pointer bg-brand-primary text-white py-5 lg:py-4 px-6 rounded-lg font-medium hover:bg-brand-hover transition-all text-md shadow-md lg:shadow-sm"
                  onClick={handleSearch}
                >
                  Find Jobs
                </button>
              </div>
            </div>

            {popularSearches.length > 0 && (
              <div className="text-sm text-content-heading mt-2">
                <span className="font-semibold mr-2">Popular Searches :</span>
                <span className="text-content-body">
                  {popularSearches.slice(0, 3).map((item, index, array) => (
                    <span key={index}>
                      <button
                        type="button"
                        onClick={() => handlePopularClick(item.term)}
                        className="hover:text-brand-primary transition-all cursor-pointer capitalize"
                      >
                        {item.term}
                      </button>
                      {index < array.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          <div className="hidden lg:flex relative shrink-0 overflow-hidden">
            <img
              src="home/banner-img.png"
              alt="Banner Hero"
              className="block w-full max-w-lg lg:w-97.5 xl:w-137.5 2xl:w-full xl:max-w-xl h-auto object-contain"
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-20 gap-5 justify-items-center">
            {jobCategories.map((cat) => {
              const IconComponent = Icons[cat.iconName];
              return (
                <Link
                  key={cat._id}
                  to={`/jobs?categoryId=${cat._id}`}
                  className="group border bg-header-bg border-gray-100 p-6 rounded-lg flex items-center gap-5 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-brand-primary/20 w-full max-w-95"
                >
                  <div className="p-4 bg-gray-100 text-brand-primary rounded-xl transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white shrink-0">
                    {IconComponent ? (
                      <IconComponent size={28} />
                    ) : (
                      <HiIcons.HiOutlineBriefcase size={28} />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base md:text-lg font-bold text-content-heading transition-colors duration-300 group-hover:text-brand-primary truncate">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({cat.openPositions} open positions)
                    </span>
                  </div>
                </Link>
              );
            })}
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
            Explore a wide range of jobs. Find the one that suits you.{" "}
          </h2>
          <p className="text-content-body text-base leading-relaxed">
            Search all open positions on the web. Get your personalized salary
            estimate. Explore detailed insights about companies worldwide.
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
        </div>
      </section>

      {payload?.role !== "job_seeker" && (
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
                    Advertise your jobs to a wide audience and search CVs in our
                    extensive database.
                  </h2>
                </div>
                <div>
                  <button
                    className="bg-brand-primary cursor-pointer text-white px-5 md:px-10 py-3 md:py-4 rounded-lg text-s md:text-md font-medium hover:bg-brand-hover transition-all shadow-lg shadow-brand-primary/20 whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!payload) {
                        toast.error("Log in to start recruiting");
                      } else {
                        navigate("/post-job");
                      }
                    }}
                  >
                    Start Recruiting Now
                  </button>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 h-full w-[35%] md:w-[40%] justify-end items-end pointer-events-none hidden sm:flex">
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
      )}
    </div>
  );
};

export default HomePageContent;
