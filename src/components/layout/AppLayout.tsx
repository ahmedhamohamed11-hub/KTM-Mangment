import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

const getTitleFromPath = (path: string) => {
  if (path === "/") return "Dashboard";
  if (path.startsWith("/kunden")) return "Kunden";
  if (path.startsWith("/projekte")) return "Projekte";
  if (path.startsWith("/kalender")) return "Kalender";
  if (path.startsWith("/materialien")) return "Materialien";
  if (path.startsWith("/angebote")) return "Angebote";
  if (path.startsWith("/bestellungen")) return "Bestellungen";
  if (path.startsWith("/einstellungen")) return "Einstellungen";
  return "KTM";
};

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:pl-[264px] transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} title={getTitleFromPath(location)} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
