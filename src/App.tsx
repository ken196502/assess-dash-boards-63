import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Personal from "./pages/Personal";
import PersonalDetail from "./pages/PersonalDetail";
import TemplateManagement from "./pages/TemplateManagement";
import DepartmentTemplateManagement from "./pages/DepartmentTemplateManagement";
import UnifiedTemplateManagement from "./pages/UnifiedTemplateManagement";
import TemplateDetail from "./pages/TemplateDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              <header className="h-14 border-b bg-background flex items-center px-4">
                <SidebarTrigger />
              </header>
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/department" element={<Index />} />
                  <Route path="/department-template" element={<DepartmentTemplateManagement />} />
                  <Route path="/personal" element={<Personal />} />
                  <Route path="/personal/:id" element={<PersonalDetail />} />
                  <Route path="/template-management" element={<UnifiedTemplateManagement />} />
                  <Route path="/template-detail/:id" element={<TemplateDetail />} />
                  <Route path="/legacy-template-management" element={<TemplateManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
