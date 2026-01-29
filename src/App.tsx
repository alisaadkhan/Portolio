import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import ProfileManager from "./pages/admin/ProfileManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import SkillsManager from "./pages/admin/SkillsManager";
import CertificationsManager from "./pages/admin/CertificationsManager";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProfileManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProjectsManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <SkillsManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CertificationsManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
