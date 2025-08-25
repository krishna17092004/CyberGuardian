export interface Threat {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated' | 'analyzing' | 'resolved';
  sourceIp?: string;
  targetSystem?: string;
  location?: string;
  aiConfidence: number;
  affectedUsers?: number;
  detectedAt: string;
  mitigatedAt?: string;
  metadata?: any;
}

export interface SystemMetrics {
  threatCount: number;
  systemHealth: number;
  aiConfidence: number;
  threatStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface WebSocketMessage {
  type: 'new_threat' | 'threat_updated' | 'metric_updated' | 'subscribed' | 'system_alert';
  data: any;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'platform_help' | 'cybersecurity_info' | 'threat_analysis';
  confidence?: number;
  sources?: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  category: string;
  tags?: string[];
  url?: string;
  imageUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  duration: number;
  maxPoints: number;
  instructions: string;
  scenarios?: any;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  profileImageUrl?: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active' | 'mitigated' | 'analyzing' | 'resolved';
export type ThreatType = 'phishing' | 'ransomware' | 'malware' | 'insider' | 'ddos';
