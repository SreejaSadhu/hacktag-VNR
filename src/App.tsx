import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingCheck } from "@/components/auth/OnboardingCheck";
import { AuthService } from "@/lib/AuthService"; // ✅ import service

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Onboarding from "./pages/Onboarding";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import GenerateWebsite from "./pages/dashboard/GenerateWebsite";
import InfluencerMatch from "./pages/dashboard/InfluencerMatch";
import EmailMarketing from "./pages/dashboard/EmailMarketing";
import AIInsights from "./pages/dashboard/AIInsights";
import Chatbot from "./pages/dashboard/Chatbot";
import FeedbackAnalyzer from "./pages/dashboard/FeedbackAnalyzer";
import Analytics from "./pages/dashboard/Analytics";
import Community from "./pages/dashboard/Community";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // 🔹 Handle Google Redirect Result once on app load
  useEffect(() => {
    (async () => {
      try {
        const redirectUser = await AuthService.handleRedirectResult();
        if (redirectUser) {
          console.log("✅ Redirect login successful:", redirectUser);
          // 👉 Here you could:
          // - save user in context/store
          // - navigate to dashboard
        }
      } catch (err) {
        console.error("Redirect login failed:", err);
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="boostly-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Email Verification Route */}
              <Route
                path="/verify-email"
                element={
                  <ProtectedRoute>
                    <VerifyEmail />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <OnboardingCheck>
                      <DashboardLayout />
                    </OnboardingCheck>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="generate" element={<GenerateWebsite />} />
                <Route path="influencer" element={<InfluencerMatch />} />
                <Route path="email" element={<EmailMarketing />} />
                <Route path="insights" element={<AIInsights />} />
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="feedback" element={<FeedbackAnalyzer />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="community" element={<Community />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
