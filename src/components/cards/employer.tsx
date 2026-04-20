import { IoCheckmark } from "react-icons/io5";
const avatars = [
  "/job/job-1.webp",
  "/job/job-2.webp",
  "/job/job-3.webp",
  "/job/job-4.webp",
];

export default function EmployersCard() {
  return (
    <div className="bg-white rounded-md p-6 border border-gray-100 lg:px-7.5 shadow-[0_46px_35px_rgba(25,25,46,0.04)]">
      <div className="absolute p-3 -top-5.5 -left-5.5 rounded-full bg-brand-primary">
        <IoCheckmark className="text-white w-8 h-8" />
      </div>
      <h3 className="text-center text-gray-700 text-[15px] font-medium pb-4">
        300k+ Employers
      </h3>

      <div className="flex items-center justify-center gap-1.5 px-1.25 pb-1.25">
        <div className="flex items-center px-1.25 pb-1.25">
          {avatars.map((src, i) => (
            <div
              key={i}
              className={`rounded-full overflow-hidden -ml-2 first:ml-0 z-[${10 + i}]
        w-11 h-11 lg:w-8 lg:h-8 2xl:w-11 2xl:h-11`}
            >
              <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
          <div
            className="w-11 h-11 rounded-full bg-gray-300 flex items-center -ml-2 justify-center text-gray-700 font-bold z-41
        lg:text-sm lg:w-8 lg:h-8 2xl:w-11 2xl:h-11 2xl:text-l 3xl:w-10! 3xl:h-10!"
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
}

<div
  className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold -ml-4 z-41
        lg:text-sm lg:w-8 lg:h-8 2xl:w-11 2xl:h-11 2xl:text-l 3xl:w-10! 3xl:h-10!"
>
  +
</div>;
