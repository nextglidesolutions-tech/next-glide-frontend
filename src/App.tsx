import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/shared/ScrollToTop";
import ScrollToTopButton from "./components/shared/ScrollToTopButton";
import Chatbot from "./components/shared/Chatbot";
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
import AdminAllContacts from "./pages/AdminAllContacts";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DirectContentPage from "./pages/DirectContentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ScrollToTopButton />
        <Chatbot />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Solutions Direct Routes */}
          <Route path="/itsm" element={<DirectContentPage
            title="ITSM – IT Service Management"
            subtitle="IT Service Management"
            benefits={[
              "Standardizes IT service delivery aligned to business goals",
              "Improves incident, problem, and change resolution speed",
              "Reduces downtime and operational risk",
              "Enhances user satisfaction and service quality",
              "Ensures IT compliance and governance"
            ]}
          />} />
          <Route path="/itom" element={<DirectContentPage
            title="ITOM – IT Operations Management"
            subtitle="IT Operations Management"
            benefits={[
              "Proactive monitoring of infrastructure and applications",
              "Reduces outages through predictive alerts",
              "Improves operational efficiency and availability",
              "Optimizes resource utilization and capacity planning",
              "Enables faster root-cause analysis"
            ]}
          />} />
          <Route path="/itbm" element={<DirectContentPage
            title="ITBM – IT Business Management"
            subtitle="IT Business Management"
            benefits={[
              "Aligns IT spend with business value",
              "Improves financial transparency of IT services",
              "Enables cost optimization and budget control",
              "Supports data-driven investment decisions",
              "Measures ROI of IT initiatives"
            ]}
          />} />
          <Route path="/csm" element={<DirectContentPage
            title="CSM – Customer Service Management"
            subtitle="Customer Service Management"
            benefits={[
              "Improves customer experience and satisfaction",
              "Centralizes customer requests and interactions",
              "Reduces response and resolution time",
              "Strengthens customer retention and loyalty",
              "Provides insights into customer issues and trends"
            ]}
          />} />
          <Route path="/hrsd" element={<DirectContentPage
            title="HRSD – Human Resources Service Delivery"
            subtitle="HR Service Delivery"
            benefits={[
              "Streamlines employee service requests",
              "Improves HR process efficiency",
              "Enhances employee experience and engagement",
              "Reduces HR operational workload",
              "Ensures policy consistency and compliance"
            ]}
          />} />
          <Route path="/grc" element={<DirectContentPage
            title="GRC – Governance, Risk, and Compliance"
            subtitle="Governance, Risk, and Compliance"
            benefits={[
              "Identifies and mitigates business risks",
              "Ensures regulatory and policy compliance",
              "Improves audit readiness and reporting",
              "Protects organizational reputation",
              "Strengthens decision-making with risk visibility"
            ]}
          />} />

          {/* Services Direct Routes */}
          <Route path="/advisory-services" element={<DirectContentPage
            title="Advisory Services"
            subtitle="Strategic Advisory"
            benefits={[
              "Strategic guidance aligned to business objectives",
              "Process and maturity assessments",
              "Roadmap creation for digital transformation",
              "Risk and compliance advisory",
              "Technology and platform recommendations"
            ]}
          />} />
          <Route path="/implementations" element={<DirectContentPage
            title="Implementations"
            subtitle="Implementation Services"
            benefits={[
              "End-to-end solution deployment",
              "Configuration aligned to business processes",
              "Faster time-to-value",
              "Reduced implementation risk",
              "Seamless system integration"
            ]}
          />} />
          <Route path="/managed-support" element={<DirectContentPage
            title="Managed Support"
            subtitle="Managed Services"
            benefits={[
              "Continuous system monitoring and maintenance",
              "Reduced operational burden on internal teams",
              "Faster issue resolution with SLAs",
              "Predictable support costs",
              "Improved system stability and performance"
            ]}
          />} />
          <Route path="/training" element={<DirectContentPage
            title="Training"
            subtitle="Training & Enablement"
            benefits={[
              "Improves user adoption and productivity",
              "Reduces dependency on external support",
              "Role-based and practical learning",
              "Enhances process compliance",
              "Maximizes ROI on implemented solutions"
            ]}
          />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/service-forms" element={<AdminServiceForms />} />
          <Route path="/admin/applications" element={<AdminServiceApplications />} />

          {/* Solution Admin Routes */}
          <Route path="/admin/solutions" element={<AdminSolutions />} />
          <Route path="/admin/solution-forms" element={<AdminSolutionForms />} />
          <Route path="/admin/solution-applications" element={<AdminSolutionApplications />} />
          <Route path="/admin/all-contacts" element={<AdminAllContacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
