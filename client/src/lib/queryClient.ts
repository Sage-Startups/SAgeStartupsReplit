import { QueryClient } from "@tanstack/react-query";

async function throwOnError(res: Response): Promise<Response> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res;
}

export async function apiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  return throwOnError(res);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        await throwOnError(res);
        return res.json();
      },
      staleTime: 60_000,
      retry: false,
    },
  },
});
