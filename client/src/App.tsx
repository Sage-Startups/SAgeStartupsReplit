import { Switch, Route } from "wouter";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Sage Startups
        </h1>
        <p className="text-muted-foreground text-lg">
          AI-powered branding automation for founders.
        </p>
        <p className="text-sm text-muted-foreground">Foundation ready — pages coming next.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Page not found.</p>
        </div>
      </Route>
    </Switch>
  );
}
