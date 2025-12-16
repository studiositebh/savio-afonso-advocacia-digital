import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { UserRolesProvider } from "@/hooks/useUserRoles";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Areas from "./pages/Areas";
import Equipe from "./pages/Equipe";
import Noticias from "./pages/Noticias";
import NoticiaDetalhes from "./pages/NoticiaDetalhes";
import Artigos from "./pages/Artigos";
import Projetos from "./pages/Projetos";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostForm from "./pages/admin/PostForm";
import Contents from "./pages/admin/Contents";
import PracticeAreas from "./pages/admin/PracticeAreas";
import Leads from "./pages/admin/Leads";
import Settings from "./pages/admin/Settings";
import SEO from "./pages/admin/SEO";
import AdminUsers from "./pages/admin/AdminUsers";
import AIPostWizard from "./pages/admin/AIPostWizard";
import Subscription from "./pages/admin/Subscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserRolesProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                     <Route path="/sobre" element={<Sobre />} />
                     <Route path="/areas" element={<Areas />} />
                     <Route path="/equipe" element={<Equipe />} />
                     <Route path="/noticias" element={<Noticias />} />
                     <Route path="/noticias/:id" element={<NoticiaDetalhes />} />
                     <Route path="/artigos" element={<Artigos />} />
                     <Route path="/projetos" element={<Projetos />} />
                     <Route path="/contato" element={<Contato />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <PrivateRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/conteudos" element={<Contents />} />
                    <Route path="/areas-de-atuacao" element={<PracticeAreas />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/usuarios" element={<AdminUsers />} />
                    <Route path="/configuracoes" element={<Settings />} />
                    <Route path="/seo" element={<SEO />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/new" element={<PostForm />} />
                    <Route path="/posts/ai" element={<AIPostWizard />} />
                    <Route path="/posts/:id" element={<PostForm />} />
                    <Route path="/assinatura" element={<Subscription />} />
                  </Routes>
                </AdminLayout>
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </UserRolesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
