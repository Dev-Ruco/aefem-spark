import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import DonationsPage from "./pages/DonationsPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import CategoriesList from "./pages/admin/CategoriesList";
import GalleryEventsList from "./pages/admin/GalleryEventsList";
import GalleryEventEditor from "./pages/admin/GalleryEventEditor";
import PartnersList from "./pages/admin/PartnersList";
import NewsletterList from "./pages/admin/NewsletterList";
import ContactMessages from "./pages/admin/ContactMessages";
import Settings from "./pages/admin/Settings";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/artigo/:slug" element={<ArticlePage />} />
            <Route path="/doacoes" element={<DonationsPage />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="artigos" element={<ArticlesList />} />
              <Route path="artigos/novo" element={<ArticleEditor />} />
              <Route path="artigos/:id" element={<ArticleEditor />} />
              <Route path="categorias" element={<CategoriesList />} />
              <Route path="galeria" element={<GalleryEventsList />} />
              <Route path="galeria/novo" element={<GalleryEventEditor />} />
              <Route path="galeria/:id" element={<GalleryEventEditor />} />
              <Route path="parceiros" element={<PartnersList />} />
              <Route path="newsletter" element={<NewsletterList />} />
              <Route path="mensagens" element={<ContactMessages />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
