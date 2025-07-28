import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import LandingPage2 from "@/pages/landing-page-2";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
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
import Checkout from "@/pages/checkout";
import FinancialDashboard from "@/pages/financial-dashboard";
import TaskManager from "@/pages/task-manager";





function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Landing pages available to everyone */}
      <Route path="/landing-1" component={Landing} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={LandingPage2} />
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
