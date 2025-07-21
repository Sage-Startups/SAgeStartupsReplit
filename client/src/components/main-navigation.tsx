import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Home,
  Zap,
  Building,
  User,
  Crown,
  LogOut,
  ChevronDown
} from "lucide-react";

export function MainNavigation() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const getSubscriptionInfo = (tier: string) => {
    switch (tier) {
      case 'free':
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', icon: User };
      case 'pro':
        return { name: 'Pro Plan', color: 'bg-blue-100 text-blue-800', icon: Zap };
      case 'premium':
        return { name: 'Premium Plan', color: 'bg-purple-100 text-purple-800', icon: Crown };
      default:
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', icon: User };
    }
  };

  const userSubscriptionTier = (user as any)?.subscriptionTier || 'free';
  const subInfo = getSubscriptionInfo(userSubscriptionTier);

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    {
      label: "Home",
      icon: <Home className="w-4 h-4" />,
      path: "/dashboard",
      active: location === "/dashboard"
    },
    {
      label: "AI Suite",
      icon: <Zap className="w-4 h-4" />,
      path: "/ai-suite",
      active: location === "/ai-suite"
    },
    {
      label: "Business Suite",
      icon: <Building className="w-4 h-4" />,
      path: "/business-suite",
      active: location === "/business-suite"
    }
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">BrandAI Pro</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? "default" : "ghost"}
                onClick={() => setLocation(item.path)}
                className="flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Badge className={subInfo.color}>
              <subInfo.icon className="w-4 h-4 mr-1" />
              {subInfo.name}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={(user as any)?.profileImageUrl} />
                    <AvatarFallback>
                      {(user as any)?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">{(user as any)?.firstName || (user as any)?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{(user as any)?.firstName || (user as any)?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{(user as any)?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation('/account')}>
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Crown className="w-4 h-4 mr-2" />
                  Subscription: {subInfo.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.path} onClick={() => setLocation(item.path)}>
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}