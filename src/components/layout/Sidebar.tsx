import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  Package, 
  FileText, 
  ShoppingCart, 
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kunden", label: "Kunden", icon: Users },
  { href: "/projekte", label: "Projekte", icon: Briefcase },
  { href: "/kalender", label: "Kalender", icon: Calendar },
  { href: "/materialien", label: "Materialien", icon: Package },
  { href: "/angebote", label: "Angebote", icon: FileText },
  { href: "/bestellungen", label: "Bestellungen", icon: ShoppingCart },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[264px] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 glass border-r",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-[68px] items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
              <span className="text-lg">K</span>
            </div>
            KTM
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</div>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}>
                <span className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-foreground hover:bg-muted"
                )}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            {theme === 'dark' ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
