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
