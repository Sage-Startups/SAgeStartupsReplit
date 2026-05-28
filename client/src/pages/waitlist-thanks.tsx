import { Link } from "wouter";
import { CheckCircle2, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";

export default function WaitlistThanksPage() {
  return (
    <>
      <SEOHead title="You're on the list! — Sage Startups" description="Thanks for joining the Sage Startups waitlist." />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-4">
            <Leaf className="h-5 w-5" /> Sage Startups
          </div>
          <h1 className="text-3xl font-bold mb-3">You're on the list!</h1>
          <p className="text-muted-foreground mb-8">
            We'll send you a note the moment your spot opens up. In the meantime, follow us for product updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button>
                Create account now <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
