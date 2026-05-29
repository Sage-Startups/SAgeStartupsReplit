import { useEffect } from "react";
import { useLocation } from "wouter";

const GA_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID ?? "G-WJTY2Z42SJ";

function injectGtag() {
  if (typeof window === "undefined" || !GA_ID || (window as any).__gtagInjected) return;
  (window as any).__gtagInjected = true;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { send_page_view: false });
  `;
  document.head.appendChild(script2);
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(args);
}

export function useAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (GA_ID) injectGtag();
  }, []);

  useEffect(() => {
    if (GA_ID) {
      gtag("event", "page_view", { page_path: location });
    }

    // Also fire our own backend event
    const sessionId = document.cookie.match(/sageSessionId=([^;]*)/)?.[1];
    if (!sessionId) return;

    const ua = navigator.userAgent;
    const deviceType = /mobile/i.test(ua) && !/tablet|ipad/i.test(ua)
      ? "mobile"
      : /tablet|ipad/i.test(ua) ? "tablet" : "desktop";

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        sessionId,
        eventType: "page_view",
        pagePath: location,
        deviceType,
      }),
    }).catch(() => {});
  }, [location]);
}
