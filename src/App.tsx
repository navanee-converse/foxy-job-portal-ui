import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeLayout headerColor="lg:bg-header-bg">
                <HomePageContent />
              </HomeLayout>
            }
          />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/update-password" element={<PasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/company"
            element={
              <HomeLayout headerColor="bg-white">
                <CompanyProfile />
              </HomeLayout>
            }
          />
          <Route path="/error/400" element={<Error400 />} />

          <Route
            path="/jobs"
            element={
              <HomeLayout headerColor="bg-white">
                <JobFilterPage />
              </HomeLayout>
            }
          />
          <Route
            path="/post-job"
            element={
              <HomeLayout headerColor="bg-white">
                <PostJob />
              </HomeLayout>
            }
          />
          <Route
            path="/update-job/:id"
            element={
              <HomeLayout headerColor="bg-white">
                <UpdateJob />
              </HomeLayout>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <HomeLayout headerColor="bg-white">
                <JobDetailsPage />
              </HomeLayout>
            }
          />
          <Route
            path="/jobs/alert"
            element={
              <HomeLayout headerColor="bg-white">
                <JobAlertScreen />
              </HomeLayout>
            }
          />
          <Route
            path="/users/profile"
            element={
              <HomeLayout headerColor="bg-white">
                <UserProfile />
              </HomeLayout>
            }
          />

          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
          <Route
            path="/jobs/:jobId/applications"
            element={
              <HomeLayout headerColor="bg-white">
                <JobApplications />
              </HomeLayout>
            }
          />
          <Route
            path="/jobs/:jobId/applications/:appId"
            element={
              <HomeLayout headerColor="bg-white">
                <ApplicationDetail />
              </HomeLayout>
            }
          />
          <Route
            path="/jobs/applied"
            element={
              <HomeLayout headerColor="bg-white">
                <AppliedJobs />
              </HomeLayout>
            }
          />
          <Route path="/social-auth-success" element={<SocialAuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
