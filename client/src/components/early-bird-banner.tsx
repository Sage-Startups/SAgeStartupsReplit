import { useState } from "react";
import { Link } from "wouter";
import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hardcoded cutoff: any signup before this date gets Early Bird pricing
const EARLY_BIRD_CUTOFF = new Date("2026-09-01T00:00:00Z");

export function isEarlyBirdEligible(): boolean {
  return new Date() < EARLY_BIRD_CUTOFF;
}

export function EarlyBirdBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("sage_eb_dismissed") === "1"; } catch { return false; }
  });

  if (dismissed || !isEarlyBirdEligible()) return null;

  function dismiss() {
    try { sessionStorage.setItem("sage_eb_dismissed", "1"); } catch {}
    setDismissed(true);
  }

  return (
    <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm py-2 px-4">
      <div className="mx-auto max-w-7xl flex items-center justify-center gap-3">
        <Zap className="h-4 w-4 shrink-0 fill-white" />
        <span className="font-medium">
          Early Bird deal — lock in <strong>$22/mo for life</strong> (50% off forever). Limited spots.
        </span>
        <Link href="/signup">
          <Button size="sm" variant="secondary" className="h-6 px-3 text-xs bg-white text-amber-700 hover:bg-amber-50 shrink-0">
            Claim now
          </Button>
        </Link>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss early bird banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
