import { Shield, Tv, AlertTriangle, Gamepad2, Rss, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageType } from "@/pages/Dashboard";

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = [
  {
    id: "command-center" as PageType,
    label: "COMMAND CENTER",
    icon: Tv,
    color: "bg-cyber-cyan",
    textColor: "text-black",
  },
  {
    id: "threat-intel" as PageType,
    label: "THREAT INTEL",
    icon: AlertTriangle,
    color: "bg-cyber-red",
    textColor: "text-white",
  },
  {
    id: "war-games" as PageType,
    label: "WAR GAMES",
    icon: Gamepad2,
    color: "bg-cyber-green",
    textColor: "text-black",
  },
  {
    id: "intel-briefing" as PageType,
    label: "INTEL BRIEFING",
    icon: Rss,
    color: "bg-cyber-blue",
    textColor: "text-white",
  },
  {
    id: "operatives" as PageType,
    label: "OPERATIVES",
    icon: Users,
    color: "bg-cyber-magenta",
    textColor: "text-black",
  },
  {
    id: "intel-reports" as PageType,
    label: "INTEL REPORTS",
    icon: BarChart3,
    color: "bg-cyber-orange",
    textColor: "text-black",
  },
];

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-cyber-darker brutalist-border border-r-4 border-black flex-shrink-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-4 border-b-3 border-black bg-cyber-gray">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyber-cyan brutalist-border cyber-shadow flex items-center justify-center">
            <Shield className="text-black font-bold" size={20} />
          </div>
          <div>
            <h1 className="font-cyber text-sm font-bold text-cyber-cyan">CYBERSENTINEL</h1>
            <p className="text-xs text-gray-400">AI DEFENSE GRID</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-0">
        <div className="space-y-1">
          {/* Operations Header */}
          <div className="px-4 py-2 bg-cyber-gray">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider">OPERATIONS</h3>
          </div>
          
          {/* Navigation Items */}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-cyber-lighter transition-colors",
                  isActive && "sidebar-active"
                )}
                data-testid={`nav-${item.id}`}
              >
                <div className={cn("w-6 h-6 brutalist-border flex items-center justify-center", item.color)}>
                  <Icon className={cn("text-xs", item.textColor)} size={12} />
                </div>
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Status */}
        <div className="mt-8 px-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-3">SYSTEM STATUS</h3>
          <div className="space-y-2">
            <div className="bg-cyber-green brutalist-border p-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full threat-pulse"></div>
                <span className="text-xs font-bold">AI CORE</span>
              </div>
              <span className="text-xs text-gray-300">ONLINE</span>
            </div>
            <div className="bg-cyber-yellow brutalist-border p-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-yellow rounded-full threat-pulse"></div>
                <span className="text-xs font-bold">THREATS</span>
              </div>
              <span className="text-xs text-gray-300">MONITORING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
