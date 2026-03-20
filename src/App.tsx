import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import OtpPage from "./components/auth/otp-page";
import UpdatePassword from "./components/auth/update-password";
import RegisterPage from "./components/auth/register";
import HomeLayout from "./components/homepage";
import HomePageContent from "./components/homepage/content";
import LoginPage from "./components/auth/login";
import ForgotPasswordPage from "./components/auth/forgot-password";
import JobFilterPage from "./components/job/filter-page";
import Error400 from "./components/error/bad-request-error";
import JobDetailsPage from "./components/job/detail-page";
import CompanyProfile from "./components/profile/company";
import PostJob from "./components/job/post";
import { JobAlertScreen } from "./components/job/alert";
import UserProfile from "./components/profile/user-form";
import JobApplications from "./components/applicant/page";
import ApplicationDetail from "./components/applicant/detail-page";
import AppliedJobs from "./components/job/applied";
import { SocialAuthSuccess } from "./components/auth/third-party-success";
import UpdateJob from "./components/job/update";
import SavedJobs from "./components/job/saved";
import ChangePasswordPage from "./components/auth/change-password";
import Logout from "./components/auth/logout";
import UnauthorizedError from "./components/error/unauthorized-error";
import TooManyRequestError from "./components/error/too-many-request-error";
import ForbiddenError from "./components/error/forbidden-error";
import NotFoundError from "./components/error/not-found-error";
import InternalServerError from "./components/error/internal-server-error";
import ProtectedRoute from "./components/auth/protected-routes";
import UserProfileView from "./components/profile/user-card";

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
          <Route path="/update-password" element={<UpdatePassword />} />
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
            <Route path="/jobs" element={<JobFilterPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/users/profile" element={<UserProfile />} />
            <Route path="/users/profile-card" element={<UserProfileView/>} />

            <Route element={<ProtectedRoute roles={["job_seeker"]} />}>
              <Route path="/jobs/alert" element={<JobAlertScreen />} />
              <Route path="/jobs/applied" element={<AppliedJobs />} />
              <Route path="/jobs/saved" element={<SavedJobs />} />
            </Route>

            <Route element={<ProtectedRoute roles={["employer"]} />}>
              <Route path="/company" element={<CompanyProfile />} />
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
