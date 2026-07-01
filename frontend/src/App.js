import React, { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/pages/NotFound";
import { ADMIN_URL } from "@/lib/firebase";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Expertise = lazy(() => import("@/pages/Expertise"));
const Clients = lazy(() => import("@/pages/Clients"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const LegalPlaceholder = lazy(() => import("@/pages/LegalPlaceholder"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const BlogManager = lazy(() => import("@/pages/admin/BlogManager"));
const BlogEditor = lazy(() => import("@/pages/admin/BlogEditor"));
const Leads = lazy(() => import("@/pages/admin/Leads"));
const SiteConfigEditor = lazy(() => import("@/pages/admin/SiteConfigEditor"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));

function App() {
  return (
    <div className="App">
      <SiteConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <ScrollToTop />
              <Toaster position="top-center" richColors offset={24} />
              <CookieBanner />
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading…</div>}>
                <Routes>
                {/* Public marketing site */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/expertise" element={<Expertise />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<LegalPlaceholder slug="privacy-policy" />} />
                  <Route path="/terms-conditions" element={<LegalPlaceholder slug="terms-conditions" />} />
                  <Route path="/cookie-policy" element={<LegalPlaceholder slug="cookie-policy" />} />
                </Route>

                {/* Secret admin URL */}
                <Route path={`${ADMIN_URL}/login`} element={<Login />} />
                <Route
                  path={ADMIN_URL}
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="blog" element={<BlogManager />} />
                  <Route path="blog/:id" element={<BlogEditor />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="site-config" element={<SiteConfigEditor />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </SiteConfigProvider>
    </div>
  );
}

export default App;
