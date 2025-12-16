import { FileText, Newspaper, FolderOpen, Image, LogOut, LayoutDashboard, Briefcase, UserCog, MessageSquare, Settings, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const cmsItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Conteúdos", url: "/admin/conteudos", icon: FileText },
  { title: "Áreas de Atuação", url: "/admin/areas-de-atuacao", icon: Briefcase },
  { title: "Leads", url: "/admin/leads", icon: MessageSquare },
  { title: "Usuários", url: "/admin/usuarios", icon: UserCog },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
  { title: "SEO", url: "/admin/seo", icon: Search },
];

const blogItems = [
  { title: "Notícias", url: "/admin/posts?type=news", icon: Newspaper },
  { title: "Artigos", url: "/admin/posts?type=article", icon: FileText },
  { title: "Categorias", url: "/admin/categories", icon: FolderOpen },
  { title: "Mídia", url: "/admin/media", icon: Image },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      collapsible="icon"
    >
      <div className="p-4 flex items-center justify-center border-b">
        <img 
          src="/lovable-uploads/ea012dd9-4d66-4596-95af-836883f5642c.png" 
          alt="Logo" 
          className={state === "expanded" ? "h-12" : "h-8"}
        />
      </div>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {cmsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Blog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {blogItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {state === "expanded" && <span>Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}