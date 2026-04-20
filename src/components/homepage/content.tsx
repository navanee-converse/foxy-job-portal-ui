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
import { LiaFileUploadSolid } from "react-icons/lia";
import { SlMagnifier } from "react-icons/sl";
import { TfiEmail } from "react-icons/tfi";
import { getDecodedToken } from "@/utils/auth";
import { SlLocationPin } from "react-icons/sl";
import toast from "react-hot-toast";
import { VscBriefcase } from "react-icons/vsc";
import { highlightMatch } from "@/utils/highlight-match";
import { BiCoinStack } from "react-icons/bi";
import {
  Briefcase,
  Car,
  Check,
  ChevronRight,
  Code,
  FileSearch,
  Headphones,
  HeartPulse,
  Mail,
  Megaphone,
  PencilRuler,
  Rocket,
  Upload,
} from "lucide-react";
import { FaRegBookmark } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { GrCurrency } from "react-icons/gr";
import { categories, jobs, logos, testimonials } from "@/mocks/content";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import DoubleQuotes from "../icons/double-quotes.png";
import type { EmblaCarouselType } from "embla-carousel";
import { MdOutlineCheck } from "react-icons/md";
import EmployersCard from "../cards/employer";
import { articles, stats } from "@/mocks/category";
import { BsDot } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";

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
  const [api, setApi] = useState<EmblaCarouselType | undefined>(undefined);
  const [logoApi, setLogoApi] = useState<EmblaCarouselType | undefined>(
    undefined,
  );
  const [current, setCurrent] = React.useState(0);

  const titleSearch = useSearchSuggestions<Job>(
    "/jobs?limit=5&title=",
    (job) => job.title,
  );

  const [count, setCount] = useState(0);
  const [popularSearches, setPopularSearches] = useState<{ term: string }[]>(
    [],
  );
  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!logoApi) return;

    let startX = 0;

    const handlePointerDown = () => {
      startX = logoApi.containerNode().scrollLeft;
    };

    const handlePointerUp = () => {
      const endX = logoApi.containerNode().scrollLeft;

      const diff = endX - startX;

      if (Math.abs(diff) < 20) return; // ignore small drag

      if (diff > 0) {
        logoApi.scrollNext(); // 👉 smooth next
      } else {
        logoApi.scrollPrev(); // 👉 smooth prev
      }
    };

    logoApi.on("pointerDown", handlePointerDown);
    logoApi.on("pointerUp", handlePointerUp);

    return () => {
      logoApi.off("pointerDown", handlePointerDown);
      logoApi.off("pointerUp", handlePointerUp);
    };
  }, [logoApi]);

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
    <div className="bg-white overflow-x-hidden">
      <div className="flex flex-col md:flex-row header-gradient md:min-h-207 lg:min-h-167 xl:min-h-206.5 2xl:min-h-218.75 3xl:min-h-218.75!">
        <div className="h-full pt-48 pb-5 md:px-2.5 md:pt-47.25 lg:max-w-[55%] 2xl:pl-61.25 3xl:pl-145!">
          <div className="from-gray-100 to-gray-200 px-5 pt-6 pb-8 relative lg:pb-0">
            <div className="absolute w-56 h-56 rounded-full -top-20 -left-20 opacity-40"></div>
            <div className="absolute w-48 h-48 rounded-full -bottom-16 -right-16 opacity-30"></div>

            <div className="relative z-10">
              <h3 className="text-[26px] font-medium text-gray-800 leading-7.75 mt-0.75 md:text-[40px] md:pt-0.75 md:leading-12 xl:text-[50px] xl:leading-[60px] xl:pt-[53px] xl:pl-[40px]">
                There Are{" "}
                <span className="text-blue-600 font-medium">93,178</span>{" "}
                <span className="block xs:inline">
                  Postings <span className="2xl:inline">Here</span>{" "}
                  <span className="xl:block"></span> For{" "}
                  <span className="md:block lg:inline">you!</span>
                </span>
              </h3>

              <p className="text-[15px] text-gray-500 mt-1.5 leading-6.25 md:pt-3.5 xl:pl-10 xl:pt-4.75">
                Find Jobs, Employment & Career{" "}
                <span className="block xs:inline">Opportunities</span>
              </p>

              <div
                className="mt-10 space-y-5 md:w-[708px] lg:flex lg:bg-white lg:min-w-[55%] lg:p-6 lg:space-y-0 lg:rounded-lg lg:relative z-10 lg:w-150 lg:h-27.5 lg:border lg:border-gray-200 shadow-m 
                lg:pt-[19px] lg:pl-[20px] xl:ml-[40px] xl:h-[100px] xl:w-[688px] 3xl:w-[740px]! 3xl:h-25.5! 3xl:ml-10!"
              >
                <div className="flex items-center bg-white rounded-md px-3 py-2.75 h-17.5 lg:pl-[22px] xl:pl-[4px] xl:pt-0">
                  <span className="pl-2.25 md:pl-4.25 xl:pl-[10px]">
                    <SlMagnifier className="w-4.5 h-4.5 stroke-3 text-content-body lg:pt-[2px] lg:pl-[2px] xl:w-[23px] xl:h-[23px]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full outline-none text-sm pl-2.75 placeholder:text-content-body md:pl-5.75 lg:w-[172px] lg:pt-[2px] lg:pl-[13px] xl:w-[205px]
                    3xl:text-[15px]! 3xl:w-53.75!"
                  />
                </div>

                <div className="hidden lg:block bg-gray-200 min-h-12 left-[260px] top-[32px] w-[1px] absolute z-20 xl:left-[290px] xl:top-[20px] xl:h-[60px] 3xl:left-[313px]!"></div>

                <div
                  className="flex items-center bg-white rounded-md px-3 py-3 h-17.5 lg:pl-[32px] lg:pt-[16px] xl:pl-[49px] 
                xl:pt-[2px] 3xl:pl-[50px]! 3xl:pt-[5px]!"
                >
                  <span className="pl-1.75 md:pl-4.25 lg:pl-[1px]">
                    <SlLocationPin className="w-5 h-5 stroke-3 text-content-body xl:w-[23px] xl:h-[23px]" />
                  </span>
                  <input
                    type="text"
                    placeholder="City or postcode"
                    className="w-full outline-none text-sm pl-2.75 placeholder:text-content-body md:pl-5.5 lg:pl-[10px] 3xl:text-[15px]!"
                  />
                </div>

                <button className="w-full bg-brand-primary cursor-pointer text-white pt-3.5 mt-3 pb-2.5 rounded-[5px] text-[15px] md:h-[50px] md:rounded-md lg:w-[150px] lg:h-[50px] lg:right-0 lg:absolute xl:w-[142px] xl:h-[60px] xl:top-[8px] xl:right-[20px] 3xl:w-[154px]!">
                  Find Jobs
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 mt-20.5 pl-5 md:mt-0 md:pt-19.25 lg:pt-6 xl:pt-[25px] xl:pl-[40px] 3xl:pt-[22px]!">
            <p className="text-[14px] font-medium text-black lg:text-content-body xl:pl-[20px] 3xl:text-[15px]">
              Popular Searches :
              <span className="block md:inline text-[14px] font-normal md:pl-6 text-content-body pt-0.75 leading-7 lg:pl-6">
                Designer, Developer, Web, IOS, PHP, Senior, Engineer,
              </span>
            </p>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[45%] relative h-full">
          <div className="absolute z-10 top-36 -left-13.75">
            <div className="absolute inset-0 ">
              <div className="absolute top-3.75 shadow-[0_40px_30px_rgba(25,25,46,0.04)] -left-0.5 w-66 h-22.5 bg-white rounded-md p-4 flex items-center gap-3 xl:left-0.5 2xl:left-12.5 3xl:left-5!">
                <div className="bg-[#fef2d9] p-3.75 rounded-lg ml-1">
                  <TfiEmail className="w-5 h-5 text-[#f9ab00]" />
                </div>
                <div className="text-[16px] font-medium pl-2 leading-5.5">
                  <p>
                    Work Inquiry From <span className="block"></span> Ali Tufan
                  </p>
                </div>
              </div>

              {/* Candidates */}
              <div
                className="absolute -top-11.5 left-87.25 pl-8.75 bg-white rounded-md p-4 h-38.25 w-58 overflow-hidden xl:top-16.25 xl:w-70 xl:left-100 
              2xl:left-[590px] 3xl:left-140!"
              >
                <p className="text-[16px] font-medium mb-2 whitespace-nowrap pt-3.75 pl-11">
                  10k+ Candidates
                </p>
                <div className="flex -space-x-4 xl:pt-[4px]">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-30 h-14 bg-gray-300 rounded-full border-2 border-white"
                    />
                  ))}
                  <div className="w-30 h-14 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-md 3xl:text-xl! 3xl:font-bold">
                    +
                  </div>
                </div>
              </div>

              {/* Creative Agency */}
              <div className="absolute bottom-10 w-66 h-23 pl-5 bg-white rounded-md shadow flex  gap-3 lg:w-[600px] top-[231px] left-[336px] p-5 xl:w-[290px] xl:top-[346px] xl:items-center 2xl:left-[530px] 3xl:left-[498px]!">
                <div className="bg-[#f7d6d3] rounded-full p-3.25 ">
                  <VscBriefcase className="w-6.5 h-6.5 text-[#d93025]" />
                </div>
                <div className="whitespace-nowrap pl-[3px]">
                  <p className="font-medium pl-[2px]">Creative Agency</p>
                  <p className="text-sm text-gray-500 p-[4px] lg:text-[15px]">
                    Startup
                  </p>
                </div>
                <div className="ml-auto bg-red-100 rounded-full p-[7px]">
                  <Check className="w-4 h-4 text-white stroke-5" />
                </div>
              </div>

              {/* Upload CV */}
              <div
                className="absolute bottom-0 w-70 h-23 left-21.75 pl-[60px] bg-white items-center rounded-md shadow top-[398px] xl:top-[462px] xl:left-[102px] 
              2xl:top-[550px] 2xl:left-[152px] 3xl:left-[118px]! 3xl:top-[553px]! "
              >
                <p className="font-medium pt-[20px] pl-[6px]">Upload Your CV</p>
                <p className="text-sm text-gray-500 pt-[4px] pl-[7px] lg:text-[15px]">
                  It only takes a few seconds
                </p>
              </div>
            </div>

            <div
              className="absolute bg-white p-5 top-[356px] left-[48px] rounded-md xl:z-40 xl:top-[422px] xl:left-[62px] 
            2xl:top-[510px] 2xl:left-[110px] 2xl:shadow-md! 2xl:shadow-gray-100! 3xl:top-[513px]! 3xl:left-[78px]!"
            >
              <LiaFileUploadSolid className="text-brand-primary" size={40} />
            </div>
          </div>
          <img
            src="/home/banner-img.png"
            alt=""
            className="scale-100 top-37.25 left-10.75 absolute w-107 h-129.5 xl:w-[528px] xl:h-[635px] xl:top-37 xl:pl-[4px]
            2xl:w-[600px] 2xl:h-[725px] 2xl:left-[115px] 3xl:w-[600px]! 3xl:h-[725px]! 3xl:left-[80px]! 3xl:top-[150px]!"
          />
        </div>
      </div>
      <div
        className="w-full pt-16 py-13 px-6 bg-white pt-[15.5%] pl-[20px] md:pt-[100px] md:pl-[15px] md:pb-[85px]
      lg:pt-[9%] lg:pb-[8.5%] xl:pt-[9%] 2xl:pt-[5.5%] 2xl:pb-[6%] 2xl:pl-[1%] 3xl:pt-[4.3%]! 3xl:pb-[4.3%]!"
      >
        {/* Header */}
        <div className="text-center mb-12 pl-1 lg:pl-[4px]">
          <h2 className="text-3xl font-medium text-[26px] md:text-[30px] md:pt-[6px]">
            Popular Job Categories
          </h2>
          <p className=" text-content-body text-[14px] pt-[7%] md:pt-[20px] md:text-[15px] md:pt-[17px] lg:pl-[4px]">
            2020 jobs live - 293 added today.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] pt-[2%] md:gap-[30px] md:pt-0 lg:p-0
         xl:w-[100%] xl:pl-[2%] xl:gap-[24px] 2xl:px-[15.8%] 3xl:px-[24.5%]!"
        >
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition p-[18px] pb-[88px] pt-[20px] pl-[20px] pb-[20px] w-[101%] h-[111px] md:w-[356px]
              lg:w-[315px] lg:h-[110px] lg:pt-[17px] lg:pl-[19px] xl:w-[100%] xl:mb-[6px]"
            >
              {/* Icon Box */}
              <div className="w-[70px] h-17.5 flex items-center rounded-lg bg-[#ecedf2] text-blue-600 p-4.5">
                <img src={item.icon} alt="" className="w-[38px] h-[36px]" />
              </div>

              {/* Text */}
              <div className="pl-0.5">
                <h3
                  className="font-medium text-[16px] pt-2.25 pl-px md:text-[18px] md:pl-0.75 cursor-pointer hover:text-brand-primary
                transition duration-300"
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm pt-1.25 md:pt-1.75 md:pl-0.75">
                  ({item.jobs})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 md:pt-5" />

      <div
        className="bg-white py-[11.6%] px-[20px] md:pt-7.5 md:px-4 md:pb-[6.5%] 
      lg:pb-[9%] lg:pt-[75px] xl:pb-[7.55] 2xl:px-[18%] 2xl:pb-[5%] 3xl:px-[25%]! 3xl:pb-[3.5%]!"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-[26px] font-medium md:text-[30px]">
            Featured Jobs
          </h2>
          <p className="text-[14px] text-content-body leading-6.5 pt-3 pb-12.5 md:text-[15px]">
            Know your worth and find the job that qualify your life
          </p>
        </div>

        {/* Job Grid */}
        <div
          className="grid gap-5 sm:grid-cols-1 md:gap-7 lg:gap-6.25 lg:grid-cols-2
        xl:px-[16px]"
        >
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 py-5 px-3 md:p-7.5 md:relative
              lg:pb-[20px] hover:shadow-lg hover:shadow-gray-200/40 duration-300"
            >
              {/* Top Section */}
              <div className="absolute right-5 top-5.25 hover:bg-gray-200 hover:rounded-full cursor-pointer p-2">
                <FaRegBookmark />
              </div>
              <div className="flex items-start gap-4 pl-[8px] md:p-0">
                <div>
                  <img src={job.image} alt="" />
                </div>

                <div className="pl-[4px] leading-[20.9px] xl:pl-[2px]">
                  <h3
                    className="font-medium text-gray-800 lg:text-[18px] hover:text-brand-primary
                transition duration-300 cursor-pointer w-fit"
                  >
                    {job.title}
                  </h3>

                  <div
                    className="text-sm text-gray-500 flex flex-col xs:flex-row! flex-wrap gap-1.5 pt-[15px] xs:gap-[18px]! 
                  lg:gap-[10px]! xl:gap-[20px]! xl:pt-[18px]"
                  >
                    <div className="flex gap-[5px]">
                      <span>
                        <VscBriefcase className="w-5 h-5" />
                      </span>{" "}
                      {job.company}
                    </div>
                    <div className="flex gap-[5px] block">
                      {" "}
                      <span>
                        <SlLocationPin className="w-5 h-5" />
                      </span>{" "}
                      {job.location}
                    </div>

                    <div className="hidden md:flex gap-[5px]">
                      {" "}
                      <span>
                        <MdAccessTime className="w-5 h-5" />
                      </span>{" "}
                      {job.postedAt}
                    </div>

                    <div className="hidden md:flex gap-[5px] lg:w-full xl:w-fit">
                      {" "}
                      <span>
                        <GrCurrency className="w-5 h-5" />
                      </span>{" "}
                      {job.salary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5 text-[13px] pl-[8px] pt-[26px] pb-[10px] md:pl-[68px] md:pt-[18px] md:gap-[15px]">
                <span className="px-5 py-0.75 bg-[#dde8f8] text-brand-primary rounded-full">
                  {job.type}
                </span>
                <span className="px-5 py-0.75 bg-[#e1f2e5] text-[#3dac5a] rounded-full">
                  {job.privacy}
                </span>
                <span className="px-5 py-0.75 bg-[#fef2d9] text-[#f9af0b] rounded-full">
                  {job.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="items-center flex justify-center pt-8.75 md:pt-11.25">
          <button
            className="p-4 bg-brand-primary text-[15px] text-white rounded-lg px-[35px]
          hover:bg-brand-btn-hover cursor-pointer transition-colors duration-300"
          >
            Load More Listing
          </button>
        </div>
      </div>

      <div className="w-full bg-button-bg py-12.5 md:pt-[12%] lg:pt-[10%] xl:pt-[8.1%] 2xl:pt-[5.5%]">
        <div>
          <h2 className="text-center text-[26px] font-medium leading-[30px] md:text-[30px]">
            Testimonials From Our Customers
          </h2>
          <div
            className="text-center text-[14px] text-content-body py-[20px] leading-[25px] md:text-[15px]
            lg:pt-[1.9%] xl:pt-[1.4%] 2xl:pt-[1%] 3xl:pt-[0.75%]!"
          >
            Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
          </div>
        </div>
        <div className="p-[15px] pt-[35px] md:px-[0] xl:pt-[40px]">
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent className="flex md:-ml-12">
              {testimonials.map((item, index) => (
                <CarouselItem
                  key={index}
                  className={`basis-full md:basis-[78%] md:pl-[50px] lg:basis-[60%] xl:basis-[505] xl:flex xl:justify-center xl:max-w-fit ${
                    current === index ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <div
                    className="bg-white rounded-md p-6 md:px-[20px] border border-gray-100 shadow-gray-300/20 shadow-sm 
                  relative xl:max-w-[588px] xl:p-[30px]"
                  >
                    <div>
                      <img
                        src={DoubleQuotes}
                        alt=""
                        className="absolute right-[15px] top-[5px] w-15 h-18"
                      />
                    </div>
                    <h3 className="text-brand-primary font-medium text-[18px] p-2">
                      {item.title}
                    </h3>

                    <p
                      className="text-gray-600 text-[16px] leading-[28px] p-2.5 lg:p-2 lg:leading-[26px]
                    xl:leading-[26px] xl:pt-[11px]"
                    >
                      {item.text}
                    </p>

                    <div className="flex items-center gap-3 pt-[30px] pl-[8px] pb-[10px] lg:pt-[40px] xl:gap-[10px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-full xl:w-18 xl:h-18"
                      />
                      <div className="pl-[8px]">
                        <p className="font-medium text-content-body xl:text-[18px]">
                          {item.name}
                        </p>
                        <p className="text-sm text-content-body">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 pt-[45px] pb-[10px] md:pb-[60px]">
          {testimonials.map((_, index) => (
            <span
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`cursor-pointer transition-all duration-300 ${
                current === index
                  ? "w-5 h-2 bg-black rounded-full"
                  : "w-2 h-2 bg-gray-300 rounded-full"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-[20px] py-[60px] md:px-[23px] lg:px-[23px] xl:px-[14.5%] 2xl:px-[23.5%]!">
        <Carousel
          setApi={setLogoApi}
          opts={{
            loop: true,
            align: "start",
            dragFree: false,
            containScroll: "trimSnaps",
            duration: 40,
          }}
          className="w-full"
        >
          <CarouselContent>
            {logos.map((logo, index) => (
              <CarouselItem
                key={index}
                className="basis-[50%] md:basis-[25%]
              lg:basis-[20%] xl:basis-[17%]"
              >
                <div className="flex items-center justify-center">
                  <img
                    src={logo}
                    alt={`logo-${index}`}
                    className="object-contain w-18.25 h-6.5 xs:w-21.75 xs:h-7.75
                    md:w-23.25 md:h-8.25 lg:w-24 lg:h-8.5 cursor-pointer"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="w-full border-t border-gray-200"></div>

      <section
        className="py-12 px-5 flex flex-col lg:flex-row items-center gap-25 relative md:pt-23.75 md:py-3.75 md:px-3.75 md:gap-26 
      lg:gap-6 lg:items-start xl:pt-27.5 2xl:px-74.5 2xl:py-25 3xl:px-153.75!"
      >
        <div className="flex-1 w-full xl:pl-7.5 ">
          <img
            src="home/work-img.webp"
            alt="Find your job"
            className="w-full object-cover rounded-xs shadow-sm"
          />
        </div>
        <div
          className="absolute top-65 xs:top-78.75 ml:top-91.5 md:top-191.25
        lg:top-128.25 lg:left-118.5 xl:top-155 xl:left-155 2xl:top-145.5 2xl:left-195 3xl:left-295! 3xl:top-152!"
        >
          <EmployersCard />
        </div>
        <div className="flex-1 flex flex-col gap-6 lg:gap-3.75 xl:pl-19.5 2xl:pl-21.25">
          <h2
            className="text-[28px] font-medium leading-8.75 md:text-[40px]
          md:leading-13 lg:leading-13.75 "
          >
            Millions of Jobs. Find the one{" "}
            <span className="2xl:block">that suits you.</span>
          </h2>
          <p className="text-content-body text-[15px] leading-6.25 md:w-97.5">
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 600,000 companies worldwide.
          </p>
          <div className="flex flex-col text-[15px] pt-2.5 gap-6.25 lg:gap-5.75 lg:pt-4">
            {[
              "Bring to the table win-win survival",
              "Capitalize on low hanging fruit to identify",
              "But I must explain to you how all this",
            ].map((text, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex gap-2">
                  <span>
                    {" "}
                    <IoCheckmark className="w-5.5 h-5.5" />
                  </span>
                  <p className="text-content-heading">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 lg:pt-6.25">
            <button
              className="bg-brand-primary text-white cursor-pointer hover:bg-brand-btn-hover px-8.75 py-3.75 rounded-md w-fit 
            transition-colors duration-300 text-[15px] lg:py-4 relative z-10"
            >
              {" "}
              Get Started
            </button>
          </div>
        </div>
      </section>

      <div
        className="text-center pt-3.75 pb-10 md:flex md:flex-1 md:pt-23.75 md:px-0.75 md:pb-22.5 
      lg:pt-28.75 2xl:pt-8.75 2xl:px-75 3xl:px-157.5! 3xl:pt-2.5!"
      >
        {stats.map((item, index) => (
          <div key={index} className="md:w-[33.33%]">
            <div className="text-[38px] font-medium pt-7 md:text-[50px] md:pt-6">
              {item.value}
            </div>
            <h4 className="text-[15px] text-content-body py-3.75 md:pt-0.5">
              {item.label}
            </h4>
          </div>
        ))}
      </div>

      <div
        className="bg-[#ecedf2] pt-12 pb-7 px-5 md:py-25 md:px-3.75 xl:px-7.5
      2xl:px-78 3xl:px-160!"
      >
        <div className="text-center">
          <h2 className="text-[26px] font-medium md:text-[30px]">
            Recent News Articles
          </h2>
          <p className="text-content-body text-[14px] pt-3.25 leading-6.5 md:text-[15px] md:pt-2.5">
            Fresh job related news content posted each day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12.5">
          {articles.map((item) => (
            <div key={item.id} className="bg-white p-2.5 rounded-md group">
              <div className=" overflow-clip rounded-md ">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg w-64.75 h-64.5 object-cover xs:w-78.75 xs:h-64.5 ml:w-91.25 ml:h-64.5 
                xl:w-97.75 group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="p-2.5 md:p-5">
                <div className="text-sm text-content-body pb-5 flex md:pt-0.75 md:pb-4">
                  <div className="pr-3 pb-1.25">{item.date}</div>
                  <div>
                    <GoDotFill className="w-3 h-3 mt-1.25" />
                  </div>{" "}
                  <div className="pl-2.75">{item.comments}</div>
                </div>

                <h3 className="text-lg font-medium pb-2">{item.title}</h3>

                <p className="text-gray-500 text-[15px] leading-6.25 pb-3.75 3xl:text-[14px]!">
                  {item.description}
                </p>

                <button className="text-brand-primary flex items-center gap-1 cursor-pointer">
                  Read More
                  <span className="pl-2">
                    {" "}
                    <ChevronRight className="w-3.5 h-3.5 stroke-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="pt-12.5 pb-7.5 px-5 md:pb-12.5 lg:flex lg:flex-row-reverse w-full lg:items-start lg:pt-35 lg:pl-2.5
      xl:pt-43.75 xl:pl-6.75 2xl:pt-38.75 3xl:pl-0! 3xl:pt-38.75!"
      >
        <div className="px-3 pb-30 w-full lg:pl-16 lg:pt-15 xl:pt-27.5 xl:pl-12.5 2xl:pl-5 3xl:pl-2!">
          <div className="text-center lg:text-start">
            <span className="text-[16px] text-brand-primary font-medium md:text-[18px]">
              DOWNLOAD & ENJOY
            </span>
            <h2 className="text-[28px] font-medium leading-8.75 pt-2.5 md:text-[46px] md:leading-13.75">
              Get the Superio Job <span className="ml:block">Search App</span>
            </h2>
            <div
              className="text-[14px] text-content-body pt-2.5
            leading-6.25 md:text-[15px] lg:pt-4"
            >
              Search through millions of jobs and find the right fit. Simply
              <br /> swipe right to apply.
            </div>
          </div>
          <div
            className="flex flex-col py-8.75 items-center ml:flex-row ml:justify-center ml:pt-6.25 ml:gap-7.25
          lg:flex-col lg:items-start lg:pt-7.5 xl:flex-row xl:justify-start"
          >
            <img
              src="/home/ios-image.webp"
              alt=""
              className="w-43.75 cursor-pointer h-12.5 ml:w-43.75 ml:h-12.5 lg:w-52.5 lg:h-15"
            />
            <img
              src="/home/android-image.webp"
              alt=""
              className="w-39.75 cursor-pointer h-12.5 mt-5 ml:w-39.75 ml:h-12.5 ml:m-0 lg:w-52.5 lg:h-16.5"
            />
          </div>
        </div>
        <div
          className="md:flex md:justify-center md:items-center w-full xl:justify-start
        2xl:justify-center 2xl:pl-26.25 3xl:pl-0! 3xl:pr-50! 3xl:justify-end!"
        >
          <img
            src="/home/mobile.png"
            alt=""
            className="w-75 h-87.5 ml-5 ml:ml-10 md:m-0 lg:w-119.25 lg:h-139"
          />
        </div>
      </div>

      <div
        className="px-5 py-12.5 md:px-5 lg:px-3.75 lg:pt-0 xl:pt-6.25 xl:px-7.5
      2xl:px-78.75 2xl:pt-10 3xl:px-[640px]!"
      >
        {" "}
        <section
          className="flex bg-[#eff4fc] items-center flex-row-reverse relative overflow-hidden w-full 
        rounded-md lg:items-start"
        >
          {/* <div className="absolute z-10 overflow-hidden">
          <img src="/home/announcement.png" alt="" />
        </div> */}
          <div
            className="bg-[url('/home/announcement.png')] bg-no-repeat bg-contain h-90.5 w-full absolute max-w-69.5 top-19.5 -right-43.75 
          md:-right-53 md:top-6 md:max-w-92.5 lg:-right-1.75"
          ></div>
          <div
            className=" px-7.5 pt-17.5 pb-13.75 rounded-lg w-full md:px-13.75 md:pt-11.25 md:pl-15 md:pb-15 lg:pb-14.5 lg:pt-12.5
          xl:pb-15"
          >
            <h2 className="text-[26px] font-medium md:text-[30px]">
              Recruiting?
            </h2>
            <div
              className="text-[14px] text-content-body pt-3.75 w-[75%] ml:w-[80%] pb-7.5 leading-6.25 md:text-[15px] md:pt-2.75 md:w-[75%] lg:w-[55%]
            xl:w-[40%]"
            >
              Advertise your jobs to millions of monthly users and search 15.8
              million CVs in our database.
            </div>
            <button
              className="text-[15px] text-white cursor-pointer hover:bg-brand-btn-hover
            transition-colors duration-300 bg-brand-primary pt-4.5 pb-3.75 px-8.75 rounded-md"
            >
              Start Recruiting Now
            </button>
          </div>
        </section>
      </div>

      {/* {payload?.role !== "job_seeker" && (
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
                  className="w-auto h-[80%] md:h-full object-contain object-bottom-right 3xl:w-[600px] 3xl:h-[600px]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl opacity-40"></div>
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
};

export default HomePageContent;
