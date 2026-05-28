import { createHash, randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SESSION_SECRET ?? "")).digest("hex").slice(0, 16);
}

function detectDeviceType(ua: string): string {
  if (/mobile/i.test(ua) && !/tablet|ipad/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function parseCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function isMeaningfulPath(path: string): boolean {
  if (path.startsWith("/api")) return false;
  if (path.startsWith("/@")) return false;
  if (/\.(js|mjs|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|map|ts|tsx)(\?|$)/.test(path)) return false;
  return true;
}

export function analyticsMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Always set/read sageSessionId cookie
  const cookieHeader = req.headers.cookie;
  let sageSessionId = parseCookie(cookieHeader, "sageSessionId");

  if (!sageSessionId) {
    sageSessionId = randomUUID();
    res.cookie("sageSessionId", sageSessionId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  if (!isMeaningfulPath(req.path)) {
    next();
    return;
  }

  const ip = (req.ip ?? req.socket?.remoteAddress ?? "").replace(/^::ffff:/, "");
  const ipHash = ip ? hashIp(ip) : null;
  const ua = req.headers["user-agent"] ?? "";
  const deviceType = detectDeviceType(ua);
  const country = (req.headers["cf-ipcountry"] as string) ?? (req.headers["x-country-code"] as string) ?? "unknown";
  const referrer = req.headers.referer ?? req.headers.referrer ?? null;

  // Fire-and-forget — never block the request
  Promise.all([
    storage.trackVisit({
      sessionId: sageSessionId,
      ipHash,
      userAgent: ua || null,
      referrer: typeof referrer === "string" ? referrer : null,
      country,
    }),
    req.path === "/" || req.path.startsWith("/dashboard") || req.path.startsWith("/bot")
      ? storage.trackEvent({
          sessionId: sageSessionId,
          userId: null,
          eventType: "page_view",
          pagePath: req.path,
          deviceType,
          country,
          metadata: null,
        })
      : Promise.resolve(),
  ]).catch((err) => console.error("[analytics]", err));

  next();
}
