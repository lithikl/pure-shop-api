import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SmoothScroll from "./components/SmoothScroll";
import CookieConsent from "./components/CookieConsent";
import LocaleSelector from "./components/LocaleSelector";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionPage from "./pages/CollectionPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ShippingPage from "./pages/ShippingPage";
import CookiesPage from "./pages/CookiesPage";
import SitemapPage from "./pages/SitemapPage";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <SmoothScroll>
            <Toaster position="top-center" />
            <CookieConsent />
            <LocaleSelector />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:handle" element={<CollectionPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
