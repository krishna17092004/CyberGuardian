import { AlertTriangle, Shield, Clock, MapPin, Activity, ExternalLink } from "lucide-react";
import { Threat } from "@/lib/types";
import { useThreatData } from "@/hooks/useThreatData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ThreatCardProps {
  threat: Threat;
  compact?: boolean;
  onClick?: () => void;
}

export default function ThreatCard({ threat, compact = false, onClick }: ThreatCardProps) {
  const { mitigateThreat, isMitigatingThreat } = useThreatData();
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-cyber-red text-white';
      case 'high': return 'bg-cyber-orange text-black';
      case 'medium': return 'bg-cyber-yellow text-black';
      case 'low': return 'bg-cyber-green text-black';
      default: return 'bg-cyber-gray text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-cyber-red text-white';
      case 'mitigated': return 'bg-cyber-green text-black';
      case 'analyzing': return 'bg-cyber-yellow text-black';
      case 'resolved': return 'bg-cyber-blue text-white';
      default: return 'bg-cyber-gray text-white';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phishing': return '📧';
      case 'ransomware': return '🔒';
      case 'malware': return '🦠';
      case 'ddos': return '🌊';
      case 'insider': return '👤';
      default: return '⚠️';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-cyber-green';
    if (confidence >= 70) return 'text-cyber-yellow';
    return 'text-cyber-red';
  };

  const handleMitigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (threat.status === 'active') {
      mitigateThreat(threat.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (compact) {
    return (
      <div 
        className="bg-cyber-dark brutalist-border p-4 threat-card cursor-pointer hover:bg-cyber-lighter transition-colors"
        onClick={handleCardClick}
        data-testid={`threat-card-${threat.id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`brutalist-border p-2 ${getSeverityColor(threat.severity)}`}>
              <span className="text-lg">{getThreatIcon(threat.type)}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white uppercase">{threat.type}</h4>
              <p className="text-xs text-gray-300 mt-1 line-clamp-2">{threat.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span>SOURCE: <span className="text-cyber-cyan">{threat.sourceIp || 'Unknown'}</span></span>
                <span>TARGET: <span className="text-cyber-red">{threat.targetSystem || 'Unknown'}</span></span>
                <span>AI: <span className={getConfidenceColor(threat.aiConfidence)}>{threat.aiConfidence}%</span></span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 text-xs font-bold brutalist-border ${getSeverityColor(threat.severity)}`}>
              {threat.severity.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-bold brutalist-border ${getStatusColor(threat.status)}`}>
              {threat.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-gray brutalist-border cyber-shadow threat-card">
      <div 
        className="p-6 cursor-pointer"
        onClick={handleCardClick}
        data-testid={`threat-card-${threat.id}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className={`brutalist-border p-3 ${getSeverityColor(threat.severity)}`}>
              <span className="text-2xl">{getThreatIcon(threat.type)}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg uppercase">{threat.type}</h3>
              <p className="text-gray-300 text-sm mt-1">{threat.title}</p>
              <p className="text-gray-400 text-xs mt-2">{threat.description}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className={`px-3 py-1 text-xs font-bold brutalist-border ${getSeverityColor(threat.severity)}`}>
              {threat.severity.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-xs font-bold brutalist-border ${getStatusColor(threat.status)}`}>
              {threat.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400 text-xs flex items-center">
              <Activity className="mr-1" size={10} />
              SOURCE
            </p>
            <p className="text-cyber-cyan font-bold">{threat.sourceIp || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs flex items-center">
              <Shield className="mr-1" size={10} />
              TARGET
            </p>
            <p className="text-cyber-red font-bold">{threat.targetSystem || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs flex items-center">
              <AlertTriangle className="mr-1" size={10} />
              AI CONFIDENCE
            </p>
            <p className={`font-bold ${getConfidenceColor(threat.aiConfidence)}`}>{threat.aiConfidence}%</p>
          </div>
        </div>
        
        <div className="pt-4 border-t-3 border-black">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
            <div className="flex items-center space-x-4">
              {threat.location && (
                <span className="flex items-center">
                  <MapPin size={10} className="mr-1" />
                  {threat.location}
                </span>
              )}
              {threat.affectedUsers && (
                <span>AFFECTED: {threat.affectedUsers} USERS</span>
              )}
              <span className="flex items-center">
                <Clock size={10} className="mr-1" />
                {formatDate(threat.detectedAt)}
              </span>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-4 space-y-3 animate-slideIn">
              <div className="bg-cyber-dark brutalist-border p-3">
                <h5 className="font-bold text-cyber-cyan text-sm mb-2">THREAT DETAILS:</h5>
                <div className="text-xs text-gray-300 space-y-1">
                  <p><strong>Detection Time:</strong> {formatDate(threat.detectedAt)}</p>
                  {threat.mitigatedAt && (
                    <p><strong>Mitigation Time:</strong> {formatDate(threat.mitigatedAt)}</p>
                  )}
                  {threat.metadata && (
                    <p><strong>Additional Info:</strong> {JSON.stringify(threat.metadata)}</p>
                  )}
                </div>
              </div>

              <div className="bg-cyber-dark brutalist-border p-3">
                <h5 className="font-bold text-cyber-cyan text-sm mb-2">RECOMMENDED ACTIONS:</h5>
                <ul className="text-xs text-gray-300 space-y-1">
                  {threat.severity === 'critical' && (
                    <>
                      <li>• Isolate affected systems immediately</li>
                      <li>• Activate incident response team</li>
                      <li>• Contact law enforcement if necessary</li>
                    </>
                  )}
                  {threat.severity === 'high' && (
                    <>
                      <li>• Monitor system activity closely</li>
                      <li>• Implement additional security measures</li>
                      <li>• Notify security team</li>
                    </>
                  )}
                  {threat.severity === 'medium' && (
                    <>
                      <li>• Continue monitoring</li>
                      <li>• Update security protocols</li>
                      <li>• Document findings</li>
                    </>
                  )}
                  {threat.severity === 'low' && (
                    <>
                      <li>• Log for future reference</li>
                      <li>• Schedule routine review</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-2 mt-4">
            {threat.status === 'active' && (
              <button
                onClick={handleMitigate}
                disabled={isMitigatingThreat}
                className={cn(
                  "bg-cyber-green text-black px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                data-testid={`button-mitigate-${threat.id}`}
              >
                {isMitigatingThreat ? 'MITIGATING...' : 'MITIGATE THREAT'}
              </button>
            )}
            <button
              onClick={handleCardClick}
              className="bg-cyber-blue text-white px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn"
              data-testid={`button-details-${threat.id}`}
            >
              <ExternalLink className="mr-2" size={12} />
              {isExpanded ? 'LESS DETAILS' : 'MORE DETAILS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
