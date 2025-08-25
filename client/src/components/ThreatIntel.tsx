import { AlertTriangle, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThreatCard from "./ThreatCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ThreatIntel() {
  const [filters, setFilters] = useState({
    severity: "",
    status: "",
    type: "",
    search: "",
  });

  const { data: threats, isLoading } = useQuery({
    queryKey: ["/api/threats", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      
      const response = await fetch(`/api/threats?${params}`);
      return response.json();
    },
  });

  const { data: threatStats } = useQuery({
    queryKey: ["/api/metrics"],
    select: (data) => data?.threatStats || { critical: 0, high: 0, medium: 0, low: 0 },
  });

  const filteredThreats = threats?.filter((threat: any) =>
    !filters.search || 
    threat.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    threat.description.toLowerCase().includes(filters.search.toLowerCase()) ||
    threat.sourceIp?.includes(filters.search)
  ) || [];

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-red flex items-center">
            <AlertTriangle className="mr-3" size={28} />
            THREAT INTEL
          </h1>
          <p className="text-sm text-gray-400 mt-1">ACTIVE THREAT MONITORING</p>
        </div>
      </div>

      {/* Threat Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-cyber-red brutalist-border cyber-shadow p-4" data-testid="metric-critical">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{threatStats.critical}</div>
            <div className="text-xs font-bold text-white">CRITICAL</div>
            <div className="text-white mt-2">⚠️</div>
          </div>
        </div>
        <div className="bg-cyber-orange brutalist-border cyber-shadow p-4" data-testid="metric-high">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{threatStats.high}</div>
            <div className="text-xs font-bold text-black">HIGH</div>
            <div className="text-black mt-2">🔥</div>
          </div>
        </div>
        <div className="bg-cyber-yellow brutalist-border cyber-shadow p-4" data-testid="metric-medium">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{threatStats.medium}</div>
            <div className="text-xs font-bold text-black">MEDIUM</div>
            <div className="text-black mt-2">⚡</div>
          </div>
        </div>
        <div className="bg-cyber-green brutalist-border cyber-shadow p-4" data-testid="metric-low">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{threatStats.low}</div>
            <div className="text-xs font-bold text-black">LOW</div>
            <div className="text-black mt-2">✅</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-cyber-gray brutalist-border cyber-shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="SEARCH THREATS, IPS, DESCRIPTIONS..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="bg-cyber-dark brutalist-border text-white placeholder-gray-400"
            data-testid="input-threat-search"
          />
          <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
            <SelectTrigger className="bg-cyber-dark brutalist-border text-white" data-testid="select-severity">
              <SelectValue placeholder="ALL LEVELS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">ALL LEVELS</SelectItem>
              <SelectItem value="critical">CRITICAL</SelectItem>
              <SelectItem value="high">HIGH</SelectItem>
              <SelectItem value="medium">MEDIUM</SelectItem>
              <SelectItem value="low">LOW</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="bg-cyber-dark brutalist-border text-white" data-testid="select-status">
              <SelectValue placeholder="ALL STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">ALL STATUS</SelectItem>
              <SelectItem value="active">ACTIVE</SelectItem>
              <SelectItem value="mitigated">MITIGATED</SelectItem>
              <SelectItem value="analyzing">ANALYZING</SelectItem>
              <SelectItem value="resolved">RESOLVED</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-cyber-dark brutalist-border text-white" data-testid="select-type">
              <SelectValue placeholder="ALL TYPES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">ALL TYPES</SelectItem>
              <SelectItem value="malware">MALWARE</SelectItem>
              <SelectItem value="phishing">PHISHING</SelectItem>
              <SelectItem value="ransomware">RANSOMWARE</SelectItem>
              <SelectItem value="ddos">DDoS</SelectItem>
              <SelectItem value="insider">INSIDER</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Threat Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-cyber-cyan">Loading threats...</div>
        </div>
      ) : filteredThreats.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="threats-grid">
          {filteredThreats.map((threat: any) => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </div>
      ) : (
        <div className="bg-cyber-gray brutalist-border cyber-shadow p-6">
          <div className="text-center">
            <div className="text-cyber-cyan text-6xl mb-4">🛡️</div>
            <h3 className="font-bold text-white text-xl mb-2">NO THREATS FOUND</h3>
            <p className="text-gray-400">
              {filters.search || filters.severity || filters.status || filters.type 
                ? "No threats match your current filters"
                : "All systems secure - no active threats detected"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
