import { FileText, Newspaper, FolderOpen, Image, LogOut, LayoutDashboard, Briefcase, UserCog, MessageSquare, Settings, Search, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
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

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles: string[];
}

const cmsItems: MenuItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, roles: ["admin", "cliente_admin", "editor", "content_manager"] },
  { title: "Conteúdos", url: "/admin/conteudos", icon: FileText, roles: ["admin", "cliente_admin", "content_manager"] },
  { title: "Áreas de Atuação", url: "/admin/areas-de-atuacao", icon: Briefcase, roles: ["admin", "cliente_admin", "content_manager"] },
  { title: "Leads", url: "/admin/leads", icon: MessageSquare, roles: ["admin", "cliente_admin", "content_manager"] },
  { title: "Usuários", url: "/admin/usuarios", icon: UserCog, roles: ["admin", "cliente_admin"] },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings, roles: ["admin", "cliente_admin", "content_manager"] },
  { title: "SEO", url: "/admin/seo", icon: Search, roles: ["admin", "cliente_admin", "content_manager"] },
];

const blogItems: MenuItem[] = [
  { title: "Notícias", url: "/admin/posts?type=news", icon: Newspaper, roles: ["admin", "cliente_admin", "editor"] },
  { title: "Artigos", url: "/admin/posts?type=article", icon: FileText, roles: ["admin", "cliente_admin", "editor"] },
  { title: "Categorias", url: "/admin/categories", icon: FolderOpen, roles: ["admin", "cliente_admin", "editor"] },
  { title: "Mídia", url: "/admin/media", icon: Image, roles: ["admin", "cliente_admin", "editor", "content_manager"] },
  { title: "Assinatura IA", url: "/admin/assinatura", icon: Sparkles, roles: ["admin", "cliente_admin", "editor"] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const { hasAnyRole } = useUserRoles();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  const handleSignOut = async () => {
    await signOut();
  };

  const filterItemsByRole = (items: MenuItem[]) => 
    items.filter(item => hasAnyRole(item.roles));

  const filteredCmsItems = filterItemsByRole(cmsItems);
  const filteredBlogItems = filterItemsByRole(blogItems);

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
        {filteredCmsItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>CMS</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredCmsItems.map((item) => (
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
        )}

        {filteredBlogItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Blog</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredBlogItems.map((item) => (
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
        )}

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
