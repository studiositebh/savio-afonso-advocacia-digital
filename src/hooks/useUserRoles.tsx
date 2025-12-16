import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserRolesContextType {
  roles: string[];
  loading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isContentManager: boolean;
}

const UserRolesContext = createContext<UserRolesContextType>({
  roles: [],
  loading: true,
  hasRole: () => false,
  hasAnyRole: () => false,
  isAdmin: false,
  isEditor: false,
  isContentManager: false,
});

export function UserRolesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRoles();
    } else {
      setRoles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);

      if (error) throw error;
      setRoles(data?.map(r => r.role) || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: string) => roles.includes(role);
  const hasAnyRole = (checkRoles: string[]) => checkRoles.some(r => roles.includes(r));
  
  const isAdmin = hasAnyRole(["admin", "cliente_admin"]);
  const isEditor = hasRole("editor") || isAdmin;
  const isContentManager = hasRole("content_manager") || isAdmin;

  return (
    <UserRolesContext.Provider value={{ 
      roles, 
      loading, 
      hasRole, 
      hasAnyRole,
      isAdmin,
      isEditor,
      isContentManager,
    }}>
      {children}
    </UserRolesContext.Provider>
  );
}

export function useUserRoles() {
  const context = useContext(UserRolesContext);
  if (!context) {
    throw new Error("useUserRoles must be used within a UserRolesProvider");
  }
  return context;
}
