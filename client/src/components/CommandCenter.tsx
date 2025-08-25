import { Search, Tv, ExternalLink } from "lucide-react";
import ThreatMap from "./ThreatMap";
import ChatBot from "./ChatBot";
import { useThreatData } from "@/hooks/useThreatData";
import { useQuery } from "@tanstack/react-query";
import ThreatCard from "./ThreatCard";

export default function CommandCenter() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentThreats } = useQuery({
    queryKey: ["/api/threats"],
    select: (data) => data?.slice(0, 5) || [], // Show only first 5 threats
  });

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-cyan flex items-center">
            <Tv className="mr-3" size={28} />
            COMMAND CENTER
          </h1>
          <p className="text-sm text-gray-400 mt-1">REAL-TIME THREAT MONITORING</p>
        </div>
        <button 
          className="bg-cyber-cyan text-black px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn"
          data-testid="button-activate-scan"
        >
          <Search className="mr-2" size={14} />
          ACTIVATE AI SCAN
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Threats Detected */}
        <div className="bg-cyber-red brutalist-border cyber-shadow p-4" data-testid="metric-threats-detected">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">THREATS DETECTED</p>
              <p className="text-2xl font-bold text-white">{metrics?.threatCount || 0}</p>
              <p className="text-xs text-gray-300">LAST 24H</p>
            </div>
            <div className="text-white text-2xl">⚠️</div>
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="bg-cyber-green brutalist-border cyber-shadow p-4" data-testid="metric-threats-blocked">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">THREATS BLOCKED</p>
              <p className="text-2xl font-bold text-black">{metrics?.threatStats?.high || 0}</p>
              <p className="text-xs text-gray-700">AUTO-MITIGATED</p>
            </div>
            <div className="text-black text-2xl">🛡️</div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-cyber-blue brutalist-border cyber-shadow p-4" data-testid="metric-system-health">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">SYSTEM HEALTH</p>
              <p className="text-2xl font-bold text-white">{metrics?.systemHealth || 96}%</p>
              <p className="text-xs text-gray-300">OPERATIONAL</p>
            </div>
            <div className="text-white text-2xl">💓</div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-cyber-magenta brutalist-border cyber-shadow p-4" data-testid="metric-ai-confidence">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">AI CONFIDENCE</p>
              <p className="text-2xl font-bold text-black">{metrics?.aiConfidence || 94}%</p>
              <p className="text-xs text-gray-700">CYBERSENTINEL AI</p>
            </div>
            <div className="text-black text-2xl">🧠</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Threat Map */}
        <div className="lg:col-span-2">
          <ThreatMap />
        </div>

        {/* System Analytics & AI Assistant */}
        <div className="space-y-6">
          {/* System Analytics */}
          <div className="bg-cyber-gray brutalist-border cyber-shadow">
            <div className="p-4 border-b-3 border-black bg-cyber-lighter">
              <h3 className="font-bold text-cyber-green flex items-center">
                <BarChart3 className="mr-2" size={16} />
                SYSTEM ANALYTICS
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-cyber-dark brutalist-border p-3">
                  <div className="flex justify-between text-sm">
                    <span>CORE SYSTEMS</span>
                    <span className="text-cyber-cyan">ONLINE</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-cyber-blue mr-2">🔧</span>
                    <span className="text-xs">AI ENGINE</span>
                  </div>
                  <div className="bg-cyber-blue h-2 brutalist-border mt-1"></div>
                </div>

                <div className="bg-cyber-dark brutalist-border p-3">
                  <div className="flex justify-between text-sm">
                    <span>DEFENSE GRID</span>
                    <span className="text-cyber-magenta">ACTIVE</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-cyber-magenta mr-2">🛡️</span>
                    <span className="text-xs">FIREWALL</span>
                  </div>
                  <div className="bg-cyber-magenta h-2 brutalist-border mt-1"></div>
                </div>

                <div className="bg-cyber-dark brutalist-border p-3">
                  <div className="flex justify-between text-sm">
                    <span>ML ENGINE</span>
                    <span className="text-cyber-green">LEARNING</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-cyber-green mr-2">🧠</span>
                    <span className="text-xs">SANDBOX</span>
                  </div>
                  <div className="bg-cyber-yellow h-2 brutalist-border mt-1 relative">
                    <span className="bg-cyber-green text-black px-1 text-xs font-bold absolute top-0 left-0">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Chatbot */}
          <ChatBot />
        </div>
      </div>

      {/* Threat Intelligence Feed */}
      <div className="mt-6">
        <div className="bg-cyber-gray brutalist-border cyber-shadow">
          <div className="p-4 border-b-3 border-black bg-cyber-lighter">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-cyber-yellow flex items-center">
                <ExternalLink className="mr-2" size={16} />
                THREAT INTELLIGENCE FEED
              </h3>
              <span className="text-xs text-gray-400">
                LAST UPDATE: <span>{new Date().toLocaleTimeString()}</span>
              </span>
            </div>
          </div>
          <div className="p-4" data-testid="threat-feed">
            <div className="space-y-3">
              {recentThreats?.map((threat: any) => (
                <ThreatCard key={threat.id} threat={threat} compact />
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-400">No active threats detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
