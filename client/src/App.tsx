import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import UserDashboard from "@/pages/user-dashboard";
import Dashboard from "@/pages/dashboard";
import Section from "@/pages/section";
import Bot from "@/pages/bot";
import ProjectSessions from "./pages/project-sessions";
import NotFound from "@/pages/not-found";
import FounderDashboard from "@/pages/founder-dashboard";
import BusinessSuite from "@/pages/business-suite";
import Account from "@/pages/account";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={FounderDashboard} />
          <Route path="/dashboard" component={FounderDashboard} />
          <Route path="/ai-suite" component={UserDashboard} />
          <Route path="/business-suite" component={BusinessSuite} />
          <Route path="/account" component={Account} />
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
