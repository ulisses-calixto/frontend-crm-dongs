import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import apiClient from "@/services/apiClient";

import {
  HandHeart,
  HeartHandshake,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  LayoutPanelLeft,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";

// ------------------ MENU ------------------
const navigationItems = [
  { title: "Painel", url: "/painel-de-controle", icon: LayoutPanelLeft },
  { title: "Doações", url: "/doacoes", icon: HandHeart },
  { title: "Beneficiados", url: "/beneficiarios", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------ FETCH ORGANIZATION ------------------
  useEffect(() => {
    async function fetchOrganization() {
      try {
        setLoading(true);

        const user = await apiClient.auth.me();
        if (!user) throw new Error("Usuário não autenticado.");

        const profiles = await apiClient.get("profiles", {
          filters: { id: user.id },
          select: "organization_id",
        });

        const profile = profiles[0];
        if (!profile?.organization_id) {
          setLoading(false);
          return;
        }

        const organizations = await apiClient.get("organizations", {
          filters: { id: profile.organization_id },
        });

        setOrganization(organizations[0]);
      } catch (err) {
        console.error("Erro ao buscar organização:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [user, currentPageName, navigate]);

  const handleLogout = () => {
    signOut();
  };

  if (currentPageName === "FirstSetup") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-slate-50 backdrop-blur-sm w-60 shrink-0">
          {/* HEADER */}
          <SidebarHeader className="border-b border-slate-200 p-6 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center">
                {organization?.logo_url ? (
                  <img
                    src={organization.logo_url}
                    className="w-9 h-9 object-cover rounded-md"
                  />
                ) : (
                  <HeartHandshake className="w-6 h-6 text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-xl text-slate-900">D'ONGs</h2>

                <div className="relative w-full overflow-hidden text-slate-600">
                  <p
                    className={`text-sm whitespace-nowrap ${
                      organization?.name?.length > 20 ? "animate-marquee" : ""
                    }`}
                  >
                    {organization?.name || "Carregando..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Keyframe letreiro*/}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: inline-block;
                animation: marquee 10s linear infinite;
                padding-right: 50%;
              }
            `}</style>
          </SidebarHeader>

          {/* menu */}
          <SidebarContent className="px-4 pt-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-4 h-10 rounded-md transition-all ${
                            isActive
                              ? "bg-slate-50 border border-slate-600 text-slate-800 font-semibold"
                              : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/*Rodapé*/}
          <SidebarFooter className="border-t border-slate-200 p-4 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-slate-700 text-white font-bold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-sm text-slate-600 truncate">
                  {user?.role === "admin" ? "Administrador" : "Usuário"}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-slate-600 hover:bg-red-100 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/*Principal*/}
        <main className="flex-1 flex flex-col overflow-hidden md:ml-60">

          {/*Cabeçalho Mobile*/}
          <header className="bg-slate-50 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden
          fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 rounded-md hover:bg-slate-200 transition" />

              <div className="flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-blue-700" />
                <h1 className="text-xl font-bold text-slate-800">D'ONGs</h1>
              </div>
            </div>
          </header>

          {/*Conteúdo*/}
          <div className="flex-1 overflow-auto p-0 sm:p-6 md:p-8 pt-[80px] md:pt-0">
            {children}
          </div>
        </main>
      </div>

      <Toaster richColors />
    </SidebarProvider>
  );
}
