import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Analyse from "./pages/Analyse";
import Alerts from "./pages/Alerts";
import Academy from "./pages/Learn";
import AIAdvisor from "./pages/AIAdvisor";
import StockDetail from "./pages/StockDetail";
import CryptoDetail from "./pages/CryptoDetail";
import ETFDetail from "./pages/ETFDetail";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Heatmaps from "./pages/Heatmaps";
import NewsCenter from "./pages/NewsCenter";
import Screener from "./pages/Screener";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/analyse" element={<Analyse />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/heatmaps" element={<Heatmaps />} />
                <Route path="/news" element={<NewsCenter />} />
                <Route path="/advisor" element={<AIAdvisor />} />
                <Route path="/screener" element={<Screener />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/stock/:symbol" element={<StockDetail />} />
                <Route path="/crypto/:symbol" element={<CryptoDetail />} />
                <Route path="/etf/:symbol" element={<ETFDetail />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                </Route>
              </Route>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ClerkProvider>
  </QueryClientProvider>
);

export default App;
