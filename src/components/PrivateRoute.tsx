import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';

interface PrivateRouteProps {
  children: ReactNode;
}

// Define which roles can access which routes
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ["admin", "cliente_admin", "editor", "content_manager"],
  "/admin/conteudos": ["admin", "cliente_admin", "content_manager"],
  "/admin/areas-de-atuacao": ["admin", "cliente_admin", "content_manager"],
  "/admin/leads": ["admin", "cliente_admin", "content_manager"],
  "/admin/usuarios": ["admin", "cliente_admin"],
  "/admin/configuracoes": ["admin", "cliente_admin", "content_manager"],
  "/admin/seo": ["admin", "cliente_admin", "content_manager"],
  "/admin/posts": ["admin", "cliente_admin", "editor"],
  "/admin/posts/new": ["admin", "cliente_admin", "editor"],
  "/admin/categories": ["admin", "cliente_admin", "editor"],
  "/admin/media": ["admin", "cliente_admin", "editor", "content_manager"],
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: rolesLoading, hasAnyRole } = useUserRoles();
  const location = useLocation();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has any admin role at all
  const hasAdminAccess = hasAnyRole(["admin", "cliente_admin", "editor", "content_manager"]);
  
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  // Check specific route permissions
  const currentPath = location.pathname;
  const allowedRoles = Object.entries(ROUTE_PERMISSIONS).find(([path]) => {
    // Match exact path or path with dynamic segments
    if (currentPath === path) return true;
    if (currentPath.startsWith(path + "/")) return true;
    return false;
  })?.[1];

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
