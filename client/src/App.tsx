import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { MainNavigation } from "@/components/main-navigation";
import { EarlyBirdBanner } from "@/components/early-bird-banner";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";

// Eager-load small/public pages
import LandingPage from "@/pages/landing";
import SignInPage from "@/pages/signin";
import SignUpPage from "@/pages/signup";
import WaitlistThanksPage from "@/pages/waitlist-thanks";

// Lazy-load heavy auth-protected pages
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const AISuitePage = lazy(() => import("@/pages/ai-suite"));
const BotPage = lazy(() => import("@/pages/bot"));
const BusinessSuitePage = lazy(() => import("@/pages/business-suite"));
const AccountPage = lazy(() => import("@/pages/account"));
const CheckoutPage = lazy(() => import("@/pages/checkout"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Redirect to="/signin" />;
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground p-4">
      <p className="text-8xl font-bold text-border select-none">404</p>
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="text-sm text-center max-w-xs">
        The page you're looking for doesn't exist. Try the AI Suite or your dashboard.
      </p>
      <div className="flex gap-3">
        <a href="/dashboard" className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Dashboard
        </a>
        <a href="/ai-suite" className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent transition-colors">
          AI Suite
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  useAnalytics();

  return (
    <>
      <EarlyBirdBanner />
      <MainNavigation />
      <Switch>
        {/* Public */}
        <Route path="/" component={LandingPage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/waitlist-thanks" component={WaitlistThanksPage} />

        {/* Protected */}
        <Route path="/dashboard"><ProtectedRoute component={DashboardPage} /></Route>
        <Route path="/ai-suite"><ProtectedRoute component={AISuitePage} /></Route>
        <Route path="/bot/:botId"><ProtectedRoute component={BotPage} /></Route>
        <Route path="/business-suite"><ProtectedRoute component={BusinessSuitePage} /></Route>
        <Route path="/account"><ProtectedRoute component={AccountPage} /></Route>
        <Route path="/checkout"><ProtectedRoute component={CheckoutPage} /></Route>
        <Route path="/analytics"><ProtectedRoute component={AnalyticsPage} /></Route>

        {/* 404 */}
        <Route component={NotFoundPage} />
      </Switch>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
