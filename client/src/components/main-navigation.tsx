import { Link, useLocation } from "wouter";
import { Leaf, LayoutDashboard, Sparkles, Briefcase, Bell, LogOut, User, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

const SUITE_LINKS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/ai-suite", icon: Sparkles, label: "AI Suite" },
  { href: "/business-suite", icon: Briefcase, label: "Business" },
];

export function MainNavigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const isPublicPage = location === "/" || location === "/signin" || location === "/signup" || location === "/waitlist-thanks";
  if (isPublicPage) return null;

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  async function handleLogout() {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.clear();
    window.location.href = "/";
  }

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("") || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/50">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary mr-2">
          <Leaf className="h-5 w-5" />
          <span className="hidden sm:inline">Sage</span>
        </Link>

        {/* Suite switcher */}
        <nav className="flex items-center gap-1">
          {SUITE_LINKS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={location.startsWith(href) ? "secondary" : "ghost"}
                size="sm"
                className="gap-1.5"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Dark mode */}
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications (placeholder) */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Avatar dropdown */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profileImageUrl ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user?.firstName ?? user?.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account">
                  <DropdownMenuItem>
                    <User className="h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                </Link>
                <Link href="/account">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
