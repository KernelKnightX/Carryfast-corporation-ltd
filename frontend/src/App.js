import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import { ADMIN_URL } from "@/lib/firebase";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Expertise from "@/pages/Expertise";
import Clients from "@/pages/Clients";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import LegalPlaceholder from "@/pages/LegalPlaceholder";

import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import BlogManager from "@/pages/admin/BlogManager";
import BlogEditor from "@/pages/admin/BlogEditor";
import Leads from "@/pages/admin/Leads";
import SiteConfigEditor from "@/pages/admin/SiteConfigEditor";
import AdminUsers from "@/pages/admin/AdminUsers";

function App() {
  return (
    <div className="App">
      <SiteConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-center" richColors offset={24} />
            <CookieBanner />
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
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SiteConfigProvider>
    </div>
  );
}

export default App;
