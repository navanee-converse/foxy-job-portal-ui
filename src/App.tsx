import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import OtpPage from "./components/OtpPage";
import PasswordPage from "./components/PasswordPage";
import RegisterPage from "./components/RegisterPage";
import HomeLayout from "./components/HomePage";
import HomePageContent from "./components/HomePageContent";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import JobFilterPage from "./components/JobFilterPage";
import Error400 from "./components/Error400";
import JobDetailsPage from "./components/JobDetailsPage";
import CompanyProfile from "./components/CompanyProfile";
import PostJob from "./components/PostJob";
import { JobAlertScreen } from "./components/JobAlert";
import UserProfile from "./components/UserProfile";
import JobApplications from "./components/ApplicantsPage";
import ApplicationDetail from "./components/ApplicantDetailPage";
import AppliedJobs from "./components/AppliedJobs";
import { SocialAuthSuccess } from "./components/SocialSuccessAuth";
import UpdateJob from "./components/UpdateJob";
import SavedJobs from "./components/SavedJob";
import ChangePasswordPage from "./components/ChangePassword";
import Logout from "./components/Logout";
import InternalServerError from "./components/Errors/InternalServerError";
import TooManyRequestError from "./components/Errors/TooManyRequestError";
import NotFoundError from "./components/Errors/NotFoundError";
import ForbiddenError from "./components/Errors/ForbiddenError";
import UnauthorizedError from "./components/Errors/UnauthorizedError";

const MainLayout = ({ headerColor }: { headerColor: string }) => (
  <HomeLayout headerColor={headerColor}>
    <Outlet />
  </HomeLayout>
);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/update-password" element={<PasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/social-auth-success" element={<SocialAuthSuccess />} />
          <Route path="/error/400" element={<Error400 />} />
          <Route path="/error/401" element={<UnauthorizedError />} />
          <Route path="/error/403" element={<ForbiddenError />} />
          <Route path="/error/404" element={<NotFoundError />} />
          <Route path="/error/429" element={<TooManyRequestError />} />
          <Route path="/error/500" element={<InternalServerError />} />

          <Route element={<MainLayout headerColor="lg:bg-header-bg" />}>
            <Route path="/" element={<HomePageContent />} />
          </Route>

          <Route element={<MainLayout headerColor="bg-white" />}>
            <Route path="/company" element={<CompanyProfile />} />
            <Route path="/jobs" element={<JobFilterPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/jobs/alert" element={<JobAlertScreen />} />
            <Route path="/jobs/applied" element={<AppliedJobs />} />
            <Route path="/jobs/saved" element={<SavedJobs />} />
            <Route path="/users/profile" element={<UserProfile />} />

            <Route path="/post-job" element={<PostJob />} />
            <Route path="/update-job/:id" element={<UpdateJob />} />
            <Route
              path="/jobs/:jobId/applications"
              element={<JobApplications />}
            />
            <Route
              path="/jobs/:jobId/applications/:appId"
              element={<ApplicationDetail />}
            />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
