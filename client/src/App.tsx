import { Switch, Route, useLocation, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { MainNavigation } from "@/components/main-navigation";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/pages/landing";
import SignInPage from "@/pages/signin";
import SignUpPage from "@/pages/signup";
import WaitlistThanksPage from "@/pages/waitlist-thanks";
import DashboardPage from "@/pages/dashboard";
import AISuitePage from "@/pages/ai-suite";
import BotPage from "@/pages/bot";
import BusinessSuitePage from "@/pages/business-suite";
import AccountPage from "@/pages/account";
import CheckoutPage from "@/pages/checkout";
import AnalyticsPage from "@/pages/analytics";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/signin" />;
  return <Component />;
}

export default function App() {
  return (
    <>
      <MainNavigation />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={LandingPage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/waitlist-thanks" component={WaitlistThanksPage} />

        {/* Auth-protected routes */}
        <Route path="/dashboard">
          <ProtectedRoute component={DashboardPage} />
        </Route>
        <Route path="/ai-suite">
          <ProtectedRoute component={AISuitePage} />
        </Route>
        <Route path="/bot/:botId">
          <ProtectedRoute component={BotPage} />
        </Route>
        <Route path="/business-suite">
          <ProtectedRoute component={BusinessSuitePage} />
        </Route>
        <Route path="/account">
          <ProtectedRoute component={AccountPage} />
        </Route>
        <Route path="/checkout">
          <ProtectedRoute component={CheckoutPage} />
        </Route>
        <Route path="/analytics">
          <ProtectedRoute component={AnalyticsPage} />
        </Route>

        {/* 404 */}
        <Route>
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <p className="text-6xl font-bold text-border">404</p>
            <p className="text-lg">Page not found.</p>
            <a href="/" className="text-primary hover:underline text-sm">Go home</a>
          </div>
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}
