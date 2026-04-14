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
                    className="w-full outline-none text-sm pl-2.75 placeholder:text-content-body md:pl-5.75 lg:w-[172px] lg:pt-[2px] lg:pl-[13px] xl:w-[205px]"
                  />
                </div>

                <div className="hidden lg:block bg-gray-200 min-h-12 left-[260px] top-[32px] w-[1px] absolute z-20 xl:left-[290px] xl:top-[20px] xl:h-[60px] 3xl:left-[313px]!"></div>

                <div className="flex items-center bg-white rounded-md px-3 py-3 h-17.5 lg:pl-[32px] lg:pt-[16px] xl:pl-[49px] xl:pt-[2px] 3xl:pl-[70px]! 3xl:pt-[5px]!">
                  <span className="pl-1.75 md:pl-4.25 lg:pl-[1px]">
                    <SlLocationPin className="w-5 h-5 stroke-3 text-content-body xl:w-[23px] xl:h-[23px]" />
                  </span>
                  <input
                    type="text"
                    placeholder="City or postcode"
                    className="w-full outline-none text-sm pl-2.75 placeholder:text-content-body md:pl-5.5 lg:pl-[10px]"
                  />
                </div>

                <button className="w-full bg-brand-primary text-white pt-4 mt-3 pb-2.5 rounded-[5px] text-[15px] md:h-[50px] md:rounded-md lg:w-[150px] lg:h-[50px] lg:right-0 lg:absolute xl:w-[142px] xl:h-[60px] xl:top-[8px] xl:right-[20px] 3xl:w-[154px]!">
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
            {/* Cards Container */}
            {/* Work Inquiry */}
            <div className="absolute inset-0">
              {/* Work Inquiry */}
              <div className="absolute top-3.75 -left-0.5 w-66 h-22.5 bg-white rounded-md p-4 flex items-center gap-3 xl:left-0.5 2xl:left-12.5 3xl:left-5!">
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
            {/* <div className="bg-white justify-around flex rounded-sm gap-4 p-4">
              <div className="bg-[#fef2d9] rounded-lg">
                <TfiEmail className="text-[#f9ae08] w-6 h-6 mt-3" />
              </div>
              <p className="text-[16px] font-medium pr">
                Work Inquiry From <span className="block"></span>Ali Tufan
              </p>
            </div> */}
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
                <h3 className="font-medium text-[16px] pt-2.25 pl-px md:text-[18px] md:pl-0.75">
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
        className="bg-white py-[11.6%] px-[20px] md:pt-[30px] md:px-[16px] md:pb-[6.5%] 
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
              lg:pb-[20px]"
            >
              {/* Top Section */}
              <div className="absolute right-[28px] top-6.25">
                <FaRegBookmark />
              </div>
              <div className="flex items-start gap-4 pl-[8px] md:p-0">
                <div>
                  <div className="w-[50px] h-[48px] bg-indigo-600 rounded-lg flex items-center justify-center text-white font-medium ">
                    {job.company[0]}
                  </div>
                </div>

                <div className="pl-[4px] leading-[20.9px] xl:pl-[2px]">
                  <h3 className="font-medium text-gray-800 lg:text-[18px]">
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
          <button className="p-4 bg-brand-primary text-[15px] text-white rounded-lg px-[35px]">
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
                    className="object-contain w-[73px] h-[26px] xs:w-[87px] xs:h-[31px]
                    md:w-[93px] md:h-[33px] lg:w-[96px] lg:h-[34px]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="w-full border-t border-gray-200"></div>

      <section
        className={`${contentWidthClass} py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20`}
      >
        <div className="flex-1 w-full">
          <img
            src="home/work-img.webp"
            alt="Find your job"
            className="w-full h-auto object-cover rounded-xs shadow-sm"
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
        </div>
      </section>
      {/* <div className="w-full bg-header-bg md:py-12 lg:py-16 lg:h-215 md:h-200 pt-50">
        <div
          className={`${contentWidthClass} flex flex-col lg:flex-row items-center lg:items-end lg:justify-evenly gap-12 lg:gap-20`}
        >
          <div className="flex flex-col gap-8 w-full lg:max-w-175 z-10 lg:pb-30 md:pb-20">
            <div className="text-3xl md:text-4xl xl:text-5xl font-medium leading-tight text-content-heading text-[26px]">
              <span className="inline-block lg:whitespace-nowrap ">
                There Are <span className="text-brand-primary">{count}</span>{" "}
                Postings Here
              </span>
              <br/> For you!
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
      </section> */}
      {/* 
      <div className="w-full border-t border-gray-200"></div>

      <section
        className={`${contentWidthClass} py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20`}
      >
        <div className="flex-1 w-full">
          <img
            src="home/work-img.webp"
            alt="Find your job"
            className="w-full h-auto object-cover rounded-xs shadow-sm"
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
        </div>
      </section> */}

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
