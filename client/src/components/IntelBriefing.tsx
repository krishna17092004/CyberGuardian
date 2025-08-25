import { Rss, ExternalLink, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  tags?: string[];
  publishedAt: string;
}

const mockArticles: NewsArticle[] = [
  {
    id: "1",
    title: "LOG4J VULNERABILITY RESURFACES IN NEW ATTACK VECTOR",
    description: "Security researchers have discovered a new exploit method for the critical Log4j vulnerability, affecting numerous enterprise systems worldwide. The exploit allows for remote code execution with minimal interaction required.",
    source: "ThreatPost",
    category: "vulnerability",
    tags: ["VULNERABILITY", "LOG4J", "ZERO-DAY"],
    publishedAt: "2024-07-06T00:00:00Z",
  },
  {
    id: "2", 
    title: "PHISHING CAMPAIGN FLOODS 1M DEPARTMENTS TO STEAL CREDENTIALS",
    description: "A sophisticated phishing campaign is targeting corporate employees by sending emails that appear to be from human resources departments. The emails contain links to fake login pages designed to steal user credentials.",
    source: "Bleeping Computer",
    category: "phishing",
    tags: ["PHISHING", "SOCIAL ENGINEERING", "CREDENTIAL THEFT"],
    publishedAt: "2024-07-13T00:00:00Z",
  },
  {
    id: "3",
    title: "MASSIVE DATA BREACH AT MAJOR RETAILER EXPOSES MILLIONS OF CUSTOMERS' INFORMATION",
    description: "A leading retail chain has reported a data breach affecting millions of customer records, including credit card information and personal details.",
    source: "TechCrunch", 
    category: "breach",
    tags: ["DATA BREACH", "CREDIT CARD FRAUD"],
    publishedAt: "2023-10-29T00:00:00Z",
  },
];

const protectionTips = {
  vulnerability: [
    "Ensure all Java applications are patched to the latest version.",
    "Implement strong filtering to block unexpected outbound connections.",
    "Use a Web Application Firewall (WAF) to detect and block exploit attempts."
  ],
  phishing: [
    "Always verify the sender's email address before clicking links.",
    "Enable multi-factor authentication (MFA) on all accounts.",
    "Use links to preview the destination URL before clicking."
  ],
  breach: [
    "Monitor your bank and credit card statements regularly.",
    "Consider placing a credit freeze on your accounts to prevent unauthorized access.",
    "Use strong, unique passwords for online shopping sites."
  ]
};

export default function IntelBriefing() {
  const { data: articles = mockArticles } = useQuery({
    queryKey: ["/api/news"],
    enabled: false, // Disable for now, using mock data
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vulnerability": return "bg-cyber-red text-white";
      case "phishing": return "bg-cyber-orange text-black"; 
      case "breach": return "bg-cyber-red text-white";
      default: return "bg-cyber-blue text-white";
    }
  };

  const getTagColor = (tag: string) => {
    if (tag.includes("VULNERABILITY") || tag.includes("ZERO-DAY")) return "bg-cyber-red text-white";
    if (tag.includes("PHISHING") || tag.includes("SOCIAL")) return "bg-cyber-yellow text-black";
    return "bg-cyber-blue text-white";
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-blue flex items-center">
            <Rss className="mr-3" size={28} />
            INTEL BRIEFING
          </h1>
          <p className="text-sm text-gray-400 mt-1">CYBER NEWS & UPDATES</p>
        </div>
        <button 
          className="bg-cyber-blue text-white px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn"
          data-testid="button-refresh-news"
        >
          <RotateCcw className="mr-2" size={14} />
          GET LATEST INTEL
        </button>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-cyber-gray brutalist-border cyber-shadow">
            <div className="p-6">
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-bold brutalist-border mr-2 ${getCategoryColor(article.category)}`}>
                  {article.category.toUpperCase()}
                </span>
                {article.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className={`px-2 py-1 text-xs font-bold brutalist-border mr-2 ${getTagColor(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="font-bold text-white text-lg mb-3">{article.title}</h3>
              <p className="text-sm text-gray-400 mb-4">SOURCE: {article.source}</p>
              <p className="text-sm text-gray-300 mb-4">{article.description}</p>
              
              <div className="bg-cyber-dark brutalist-border p-3 mb-4">
                <h4 className="font-bold text-cyber-cyan text-sm mb-2">PROTECTION TIPS:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  {protectionTips[article.category as keyof typeof protectionTips]?.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                <div className="flex space-x-4">
                  {article.tags?.[2] && (
                    <span className={`px-2 py-1 brutalist-border ${getTagColor(article.tags[2])}`}>
                      {article.tags[2]}
                    </span>
                  )}
                </div>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              
              <button className="w-full bg-cyber-cyan text-black py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn">
                <ExternalLink className="mr-2" size={12} />
                READ FULL ARTICLE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Breaking News Feed */}
      <div className="bg-cyber-gray brutalist-border cyber-shadow">
        <div className="p-4 border-b-3 border-black bg-cyber-lighter">
          <h3 className="font-bold text-cyber-cyan">BREAKING CYBER NEWS</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4" data-testid="breaking-news-feed">
            <div className="border-l-4 border-cyber-red pl-4">
              <p className="text-sm text-white font-bold">NEW RANSOMWARE STRAIN TARGETS HEALTHCARE SYSTEMS</p>
              <p className="text-xs text-gray-400">2 hours ago • CyberScoop</p>
            </div>
            <div className="border-l-4 border-cyber-orange pl-4">
              <p className="text-sm text-white font-bold">CRITICAL SECURITY UPDATE RELEASED FOR POPULAR VPN SOFTWARE</p>
              <p className="text-xs text-gray-400">4 hours ago • Security Week</p>
            </div>
            <div className="border-l-4 border-cyber-yellow pl-4">
              <p className="text-sm text-white font-bold">GOVERNMENT AGENCIES WARN OF INCREASED NATION-STATE ATTACKS</p>
              <p className="text-xs text-gray-400">6 hours ago • Dark Reading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
