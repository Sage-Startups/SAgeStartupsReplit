import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import LandingPage2 from "@/pages/landing-page-2";
import SoftLaunch from "@/pages/softlaunch";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import SignUp2 from "@/pages/signup2";
import UserDashboard from "@/pages/user-dashboard";
import Dashboard from "@/pages/dashboard";
import Section from "@/pages/section";
import Bot from "@/pages/bot";
import ProjectSessions from "./pages/project-sessions";
import NotFound from "@/pages/not-found";
import FounderDashboard from "@/pages/founder-dashboard";
import BusinessSuite from "@/pages/business-suite";
import BusinessSuiteComingSoon from "@/pages/business-suite-coming-soon";
import Account from "@/pages/account";
import SuperAdmin from "@/pages/super-admin";
import Analytics from "@/pages/analytics";
import Checkout from "@/pages/checkout";
import FinancialDashboard from "@/pages/financial-dashboard";
import TaskManager from "@/pages/task-manager";
import AboutPage from "@/pages/about";
import BlogPage from "@/pages/blog";
import ContactPage from "@/pages/contact";
import PrivacyPolicyPage from "@/pages/privacy";
import TermsOfServicePage from "@/pages/terms";





function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Landing pages available to everyone */}
      <Route path="/landing-1" component={Landing} />
      <Route path="/softlaunch" component={SoftLaunch} />
      <Route path="/signup2" component={SignUp2} />

      {/* Public pages available to everyone */}
      <Route path="/about" component={AboutPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />

      {!isAuthenticated ? (
        <>
          <Route path="/" component={SoftLaunch} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </>
      ) : (
        <>
          <Route path="/" component={FounderDashboard} />
          <Route path="/dashboard" component={FounderDashboard} />
          <Route path="/ai-suite" component={UserDashboard} />
          <Route path="/business-suite-coming-soon" component={BusinessSuiteComingSoon} />
          <Route path="/business-suite" component={BusinessSuite} />
          <Route path="/account" component={Account} />
          <Route path="/checkout" component={Checkout} />

          <Route path="/super-admin" component={SuperAdmin} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/financial-dashboard" component={FinancialDashboard} />
          <Route path="/task-manager" component={TaskManager} />

          <Route path="/section/:sectionId" component={Section} />
          <Route path="/bot/:botId" component={Bot} />
          <Route path="/project/:projectId" component={ProjectSessions} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
