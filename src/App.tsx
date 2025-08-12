import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Areas from "./pages/Areas";
import Equipe from "./pages/Equipe";
import Noticias from "./pages/Noticias";
import Artigos from "./pages/Artigos";
import Projetos from "./pages/Projetos";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostForm from "./pages/admin/PostForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/new" element={<PostForm />} />
                    <Route path="/posts/:id" element={<PostForm />} />
                  </Routes>
                </AdminLayout>
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
