import { Globe } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ThreatIndicator {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  location: string;
  description: string;
  position: { top: string; left: string };
  size: string;
}

const threatIndicators: ThreatIndicator[] = [
  {
    id: "critical-1",
    type: "critical",
    title: "Ransomware Attack",
    location: "Russia",
    description: "Advanced ransomware deployment detected targeting financial systems.",
    position: { top: "12%", left: "16%" },
    size: "w-3 h-3",
  },
  {
    id: "critical-2",
    type: "critical",
    title: "DDoS Campaign",
    location: "China",
    description: "Massive distributed denial of service attack in progress.",
    position: { top: "20%", left: "65%" },
    size: "w-3 h-3",
  },
  {
    id: "high-1",
    type: "high",
    title: "Phishing Campaign",
    location: "Brazil",
    description: "Coordinated phishing emails targeting corporate credentials.",
    position: { top: "70%", left: "32%" },
    size: "w-2 h-2",
  },
  {
    id: "high-2",
    type: "high",
    title: "Malware Distribution",
    location: "United Kingdom",
    description: "Suspicious malware spreading through email attachments.",
    position: { top: "32%", left: "48%" },
    size: "w-2 h-2",
  },
  {
    id: "medium-1",
    type: "medium",
    title: "Suspicious Activity",
    location: "Japan",
    description: "Unusual network traffic patterns detected.",
    position: { top: "60%", left: "80%" },
    size: "w-2 h-2",
  },
  {
    id: "low-1",
    type: "low",
    title: "Anomaly Detected",
    location: "Germany",
    description: "Minor security anomaly under investigation.",
    position: { top: "40%", left: "52%" },
    size: "w-1 h-1",
  },
];

const threatColors = {
  critical: "bg-cyber-red",
  high: "bg-cyber-orange",
  medium: "bg-cyber-yellow",
  low: "bg-cyber-green",
};

export default function ThreatMap() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatIndicator | null>(null);

  const handleThreatClick = (threat: ThreatIndicator) => {
    setSelectedThreat(threat);
  };

  const closeModal = () => {
    setSelectedThreat(null);
  };

  return (
    <>
      <div className="bg-cyber-gray brutalist-border cyber-shadow">
        <div className="p-4 border-b-3 border-black bg-cyber-lighter">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-cyber-cyan flex items-center">
              <Globe className="mr-2" size={16} />
              GLOBAL THREAT MAP
            </h3>
            <span className="bg-cyber-cyan text-black px-2 py-1 text-xs font-bold brutalist-border">
              LIVE
            </span>
          </div>
        </div>
        <div className="p-4">
          {/* Threat Map Visualization */}
          <div className="relative h-64 bg-cyber-dark brutalist-border overflow-hidden" data-testid="threat-map">
            {/* Background grid pattern */}
            <div className="absolute inset-0 cyber-grid opacity-30"></div>
            
            {/* World map silhouette - using CSS background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark opacity-50"></div>
            
            {/* Threat Indicators */}
            {threatIndicators.map((threat) => (
              <div
                key={threat.id}
                className={`absolute ${threat.size} ${threatColors[threat.type]} rounded-full glow-red threat-pulse cursor-pointer`}
                style={threat.position}
                onClick={() => handleThreatClick(threat)}
                title={`${threat.title} - ${threat.location}`}
                data-testid={`threat-indicator-${threat.id}`}
              />
            ))}
            
            {/* Connection lines between threats (simulated) */}
            <svg className="absolute inset-0 pointer-events-none">
              <line x1="16%" y1="12%" x2="65%" y2="20%" stroke="#00ffff" strokeWidth="1" opacity="0.3" />
              <line x1="48%" y1="32%" x2="52%" y2="40%" stroke="#ffff00" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs" data-testid="threat-legend">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-red rounded-full"></div>
              <span>CRITICAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-orange rounded-full"></div>
              <span>HIGH</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-yellow rounded-full"></div>
              <span>MEDIUM</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-cyber-green rounded-full"></div>
              <span>LOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Detail Modal */}
      <Dialog open={!!selectedThreat} onOpenChange={closeModal}>
        <DialogContent className="bg-cyber-gray brutalist-border cyber-shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-cyber-cyan">THREAT DETAILS</DialogTitle>
          </DialogHeader>
          {selectedThreat && (
            <div className="space-y-4" data-testid="threat-detail-modal">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-bold brutalist-border ${
                  selectedThreat.type === 'critical' ? 'bg-cyber-red text-white' :
                  selectedThreat.type === 'high' ? 'bg-cyber-orange text-black' :
                  selectedThreat.type === 'medium' ? 'bg-cyber-yellow text-black' :
                  'bg-cyber-green text-black'
                }`}>
                  {selectedThreat.type.toUpperCase()}
                </span>
                <h4 className="text-xl font-bold text-white">{selectedThreat.title}</h4>
              </div>
              <div className="text-gray-300">
                <p><strong>Location:</strong> {selectedThreat.location}</p>
                <p className="mt-2">{selectedThreat.description}</p>
              </div>
              <div className="bg-cyber-dark brutalist-border p-4">
                <h5 className="font-bold text-cyber-cyan mb-2">RECOMMENDED ACTIONS:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Monitor affected systems for suspicious activity</li>
                  <li>• Implement additional security measures</li>
                  <li>• Contact incident response team if escalation needed</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <button className="bg-cyber-green text-black px-4 py-2 brutalist-border cyber-shadow font-bold neo-brutal-btn">
                  MITIGATE THREAT
                </button>
                <button className="bg-cyber-blue text-white px-4 py-2 brutalist-border cyber-shadow font-bold neo-brutal-btn">
                  MORE DETAILS
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
