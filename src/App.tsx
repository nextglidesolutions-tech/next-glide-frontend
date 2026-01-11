import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Solutions from "./pages/Solutions";
import Industries from "./pages/Industries";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminServiceForms from "./pages/AdminServiceForms";
import AdminServiceApplications from "./pages/AdminServiceApplications";

import AdminSolutions from "./pages/AdminSolutions";
import AdminSolutionForms from "./pages/AdminSolutionForms";
import AdminSolutionApplications from "./pages/AdminSolutionApplications";
import SolutionDetail from "./pages/SolutionDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/service-forms" element={<AdminServiceForms />} />
          <Route path="/admin/applications" element={<AdminServiceApplications />} />

          {/* Solution Admin Routes */}
          <Route path="/admin/solutions" element={<AdminSolutions />} />
          <Route path="/admin/solution-forms" element={<AdminSolutionForms />} />
          <Route path="/admin/solution-applications" element={<AdminSolutionApplications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
