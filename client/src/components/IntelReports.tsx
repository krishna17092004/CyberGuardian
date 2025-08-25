import { BarChart3, Download, FileText, FileSpreadsheet, FileCheck } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  textColor: string;
  stats: { label: string; value: string; color: string }[];
}

const reports: Report[] = [
  {
    id: "threat-analysis",
    title: "THREAT ANALYSIS REPORT",
    description: "Comprehensive summary of all detected threats, severity levels, and sources over a selected period.",
    icon: BarChart3,
    color: "bg-cyber-red",
    textColor: "text-white",
    stats: [
      { label: "PERIOD", value: "Last 30 Days", color: "text-gray-400" },
      { label: "THREATS ANALYZED", value: "847", color: "text-cyber-red" },
    ],
  },
  {
    id: "system-health",
    title: "SYSTEM HEALTH SUMMARY",
    description: "Detailed report on system performance, uptime, and AI engine effectiveness. Includes key performance indicators.",
    icon: FileCheck,
    color: "bg-cyber-green",
    textColor: "text-black",
    stats: [
      { label: "UPTIME", value: "99.8%", color: "text-cyber-green" },
      { label: "AI ACCURACY", value: "94.2%", color: "text-cyber-green" },
    ],
  },
  {
    id: "user-activity",
    title: "USER ACTIVITY LOG",
    description: "Chronological log of all user activities, simulation performance, and access records for auditing purposes.",
    icon: FileText,
    color: "bg-cyber-magenta",
    textColor: "text-black",
    stats: [
      { label: "ACTIVE USERS", value: "127", color: "text-cyber-cyan" },
      { label: "TOTAL SESSIONS", value: "2,341", color: "text-cyber-magenta" },
    ],
  },
  {
    id: "compliance",
    title: "COMPLIANCE REPORT",
    description: "Generates reports for compliance standards like GDPR, HIPAA, and SOC 2 based on system activity.",
    icon: FileSpreadsheet,
    color: "bg-cyber-yellow",
    textColor: "text-black",
    stats: [
      { label: "STANDARDS", value: "GDPR, SOC2", color: "text-cyber-yellow" },
      { label: "COMPLIANCE SCORE", value: "98%", color: "text-cyber-green" },
    ],
  },
];

const recentReports = [
  {
    id: "1",
    title: "Weekly Threat Summary - Week 45",
    date: "Nov 8, 2024 at 9:00 AM",
    type: "pdf",
    icon: FileText,
    color: "text-cyber-red",
  },
  {
    id: "2",
    title: "System Performance Metrics - October 2024",
    date: "Nov 1, 2024 at 2:30 PM",
    type: "excel",
    icon: FileSpreadsheet,
    color: "text-cyber-green",
  },
  {
    id: "3",
    title: "GDPR Compliance Audit - Q4 2024",
    date: "Oct 28, 2024 at 11:15 AM",
    type: "document",
    icon: FileCheck,
    color: "text-cyber-blue",
  },
];

export default function IntelReports() {
  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
  };

  const downloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-orange flex items-center">
            <BarChart3 className="mr-3" size={28} />
            INTEL REPORTS
          </h1>
          <p className="text-sm text-gray-400 mt-1">ANALYTICS & COMPLIANCE</p>
        </div>
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-cyber-gray brutalist-border cyber-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${report.color} brutalist-border p-3`}>
                    <Icon className={report.textColor} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{report.title}</h3>
                    <p className="text-gray-400 text-sm">{report.description}</p>
                  </div>
                </div>
                
                <div className="bg-cyber-dark brutalist-border p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {report.stats.map((stat, index) => (
                      <div key={index}>
                        <p className="text-gray-400">{stat.label}</p>
                        <p className={`font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => generateReport(report.id)}
                  className="w-full bg-cyber-cyan text-black py-3 brutalist-border cyber-shadow font-bold neo-brutal-btn"
                  data-testid={`button-generate-${report.id}`}
                >
                  <Download className="mr-2" size={16} />
                  GENERATE REPORT
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-cyber-gray brutalist-border cyber-shadow">
        <div className="p-4 border-b-3 border-black bg-cyber-lighter">
          <h3 className="font-bold text-cyber-orange">RECENT REPORTS</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4" data-testid="recent-reports">
            {recentReports.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="flex items-center justify-between bg-cyber-dark brutalist-border p-4">
                  <div className="flex items-center space-x-4">
                    <Icon className={`${report.color} text-xl`} size={24} />
                    <div>
                      <p className="font-bold text-white">{report.title}</p>
                      <p className="text-sm text-gray-400">Generated on {report.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => downloadReport(report.id)}
                    className="bg-cyber-cyan text-black px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn"
                    data-testid={`button-download-${report.id}`}
                  >
                    <Download className="mr-2" size={12} />
                    DOWNLOAD
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
