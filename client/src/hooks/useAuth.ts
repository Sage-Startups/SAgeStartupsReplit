import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  subscriptionTier: "free" | "pro" | "premium";
  subscriptionStatus: "trialing" | "active" | "cancelled" | "expired";
  trialEndsAt: string | null;
  isEarlyBird: boolean;
  createdAt: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 60_000,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
