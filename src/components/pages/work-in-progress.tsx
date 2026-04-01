import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const WorkInProgress = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <img
        src="/foxy-job-construction.png"
        alt="Working"
        className="w-100 mb-8 h-150 rounded-lg"
      />
      <Button onClick={() => navigate(-1)} className="bg-brand-primary hover:bg-brand-btn-hover cursor-pointer">
        Go Back
      </Button>
    </div>
  );
};
