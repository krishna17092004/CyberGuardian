import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CommandCenter from "@/components/CommandCenter";
import ThreatIntel from "@/components/ThreatIntel";
import WarGames from "@/components/WarGames";
import IntelBriefing from "@/components/IntelBriefing";
import Operatives from "@/components/Operatives";
import IntelReports from "@/components/IntelReports";
import { useWebSocket } from "@/hooks/useWebSocket";

export type PageType = 
  | "command-center"
  | "threat-intel" 
  | "war-games"
  | "intel-briefing"
  | "operatives"
  | "intel-reports";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<PageType>("command-center");
  
  // Connect to WebSocket for real-time updates
  useWebSocket();

  const renderPage = () => {
    switch (activePage) {
      case "command-center":
        return <CommandCenter />;
      case "threat-intel":
        return <ThreatIntel />;
      case "war-games":
        return <WarGames />;
      case "intel-briefing":
        return <IntelBriefing />;
      case "operatives":
        return <Operatives />;
      case "intel-reports":
        return <IntelReports />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-cyber-dark text-white font-mono overflow-hidden">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
}
