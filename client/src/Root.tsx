import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "./store/AppContext";
import App from "./App";

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}