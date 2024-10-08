"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ThemeProvider = dynamic(
  () => import("../components/theme-provider").then((mod) => mod.ThemeProvider),
  { ssr: false },
);
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false },
);
const TooltipProvider = dynamic(
  () => import("@/components/ui/tooltip").then((mod) => mod.TooltipProvider),
  { ssr: false },
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <h1>Great äpplication</h1>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
