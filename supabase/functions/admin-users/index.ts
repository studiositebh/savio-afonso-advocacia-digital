import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROLES_INFO = {
  admin: { name: "Administrador", description: "Acesso total ao sistema" },
  cliente_admin: { name: "Admin Cliente", description: "Gerencia conteúdo e usuários" },
  editor: { name: "Editor", description: "Apenas cria e edita posts/notícias" },
  content_manager: { name: "Gestor de Conteúdo", description: "Edita conteúdo do site, sem gerenciar usuários" },
  moderator: { name: "Moderador", description: "Modera conteúdo" },
  user: { name: "Usuário", description: "Usuário comum" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify requesting user is admin
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "cliente_admin"]);

    if (!roles || roles.length === 0) {
      console.error("User is not admin:", user.id);
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, ...params } = await req.json();
    console.log("Action:", action, "Params:", params);

    switch (action) {
      case "list": {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        // Get roles for all users
        const { data: allRoles } = await supabaseAdmin
          .from("user_roles")
          .select("user_id, role");

        const usersWithRoles = users.map(u => ({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.user_metadata?.full_name || "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          roles: allRoles?.filter(r => r.user_id === u.id).map(r => r.role) || [],
        }));

        return new Response(JSON.stringify({ users: usersWithRoles, rolesInfo: ROLES_INFO }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update": {
        const { userId, email, name } = params;
        
        const updateData: any = {};
        if (email) updateData.email = email;
        if (name !== undefined) updateData.user_metadata = { name };

        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, updateData);
        if (error) throw error;

        console.log("User updated:", userId);
        return new Response(JSON.stringify({ user: data.user }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "updatePassword": {
        const { userId, password } = params;
        
        if (!password || password.length < 6) {
          return new Response(JSON.stringify({ error: "Senha deve ter pelo menos 6 caracteres" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
        if (error) throw error;

        console.log("Password updated for user:", userId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete": {
        const { userId } = params;
        
        // Don't allow deleting yourself
        if (userId === user.id) {
          return new Response(JSON.stringify({ error: "Não é possível excluir seu próprio usuário" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;

        console.log("User deleted:", userId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "setRoles": {
        const { userId, newRoles } = params;
        
        // Don't allow removing your own admin role
        const currentUserRoles = roles.map(r => r.role);
        if (userId === user.id) {
          const removingAdmin = currentUserRoles.some(r => r === "admin" || r === "cliente_admin") &&
            !newRoles.some((r: string) => r === "admin" || r === "cliente_admin");
          if (removingAdmin) {
            return new Response(JSON.stringify({ error: "Não é possível remover seu próprio papel de administrador" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        // Delete all existing roles for this user
        await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", userId);

        // Insert new roles
        if (newRoles && newRoles.length > 0) {
          const rolesToInsert = newRoles.map((role: string) => ({
            user_id: userId,
            role: role,
          }));

          const { error } = await supabaseAdmin
            .from("user_roles")
            .insert(rolesToInsert);
          
          if (error) throw error;
        }

        console.log("Roles updated for user:", userId, "New roles:", newRoles);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create": {
        const { email, password, name, initialRoles } = params;
        
        if (!email || !password) {
          return new Response(JSON.stringify({ error: "Email e senha são obrigatórios" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (password.length < 6) {
          return new Response(JSON.stringify({ error: "Senha deve ter pelo menos 6 caracteres" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: name || "" },
        });

        if (createError) {
          console.error("Create user error:", createError);
          if (createError.message.includes("already been registered")) {
            return new Response(JSON.stringify({ error: "Este email já está cadastrado" }), {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          throw createError;
        }

        // Assign initial roles if provided
        if (initialRoles && initialRoles.length > 0 && newUser.user) {
          const rolesToInsert = initialRoles.map((role: string) => ({
            user_id: newUser.user.id,
            role: role,
          }));

          const { error: rolesError } = await supabaseAdmin
            .from("user_roles")
            .insert(rolesToInsert);
          
          if (rolesError) {
            console.error("Assign roles error:", rolesError);
          }
        }

        console.log("User created:", newUser.user?.id);
        return new Response(JSON.stringify({ user: newUser.user }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
