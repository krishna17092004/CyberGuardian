import { db } from "./db";
import {
  users,
  threats,
  newsArticles,
  simulations,
  systemMetrics,
} from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await db.delete(systemMetrics);
    await db.delete(newsArticles);
    await db.delete(threats);
    await db.delete(users);
    await db.delete(simulations);

    // Seed users
    const seedUsers = [
      {
        username: "KRISHNA",
        email: "kjb2w2024@gmail.com",
        role: "admin",
        status: "active",
      },
      {
        username: "ALEX_THOMPSON",
        email: "alex.thompson@cybersentinel.ai",
        firstName: "Alex",
        lastName: "Thompson",
        role: "analyst",
        status: "active",
      },
      {
        username: "SARAH_CHEN",
        email: "sarah.chen@cybersentinel.ai",
        firstName: "Sarah",
        lastName: "Chen", 
        role: "operator",
        status: "active",
      },
      {
        username: "MIKE_JOHNSON",
        email: "mike.johnson@cybersentinel.ai",
        firstName: "Mike",
        lastName: "Johnson",
        role: "analyst",
        status: "suspended",
      },
    ];

    await db.insert(users).values(seedUsers);

    // Seed threats
    const seedThreats = [
      {
        type: "ransomware",
        title: "Critical Ransomware Attack - Financial Sector",
        description: "Advanced ransomware strain targeting financial institutions with sophisticated encryption methods.",
        severity: "critical",
        status: "active",
        sourceIp: "198.51.100.42",
        targetSystem: "Banking Network",
        location: "Russia",
        aiConfidence: 95,
        affectedUsers: 1250,
        metadata: { attackVector: "email", encryptionType: "AES-256" },
      },
      {
        type: "ddos",
        title: "Massive DDoS Campaign Detected",
        description: "Coordinated distributed denial of service attack targeting multiple infrastructure providers.",
        severity: "critical",
        status: "active",
        sourceIp: "203.0.113.15",
        targetSystem: "Cloud Infrastructure",
        location: "China",
        aiConfidence: 89,
        affectedUsers: 5000,
        metadata: { attackType: "volumetric", bandwidth: "500Gbps" },
      },
      {
        type: "phishing",
        title: "Corporate Credential Harvesting Campaign",
        description: "Sophisticated phishing operation targeting C-level executives with personalized attacks.",
        severity: "high",
        status: "analyzing",
        sourceIp: "192.0.2.123",
        targetSystem: "Corporate Email",
        location: "Brazil",
        aiConfidence: 78,
        affectedUsers: 342,
        metadata: { emailsSent: 15000, clickRate: "2.3%" },
      },
      {
        type: "malware",
        title: "Malware Distribution Network Identified",
        description: "New malware family spreading through compromised websites and email attachments.",
        severity: "high",
        status: "mitigated",
        sourceIp: "198.51.100.88",
        targetSystem: "Enterprise Endpoints",
        location: "United Kingdom",
        aiConfidence: 85,
        affectedUsers: 89,
        metadata: { familyName: "StealthBot", persistence: "registry" },
      },
      {
        type: "insider",
        title: "Suspicious Data Access Pattern",
        description: "Anomalous data access patterns detected from privileged user account during off-hours.",
        severity: "medium",
        status: "resolved",
        sourceIp: "10.0.0.156",
        targetSystem: "Database Server",
        location: "Japan",
        aiConfidence: 72,
        affectedUsers: 12,
        metadata: { dataAccessed: "1.2TB", timePattern: "2am-4am" },
      },
    ];

    await db.insert(threats).values(seedThreats);

    // Seed news articles
    const seedNews = [
      {
        title: "LOG4J VULNERABILITY RESURFACES IN NEW ATTACK VECTOR",
        description: "Security researchers have discovered a new exploit method for the critical Log4j vulnerability, affecting numerous enterprise systems worldwide.",
        content: "The Log4j vulnerability continues to pose significant risks...",
        source: "ThreatPost",
        category: "vulnerability",
        tags: ["VULNERABILITY", "LOG4J", "ZERO-DAY"],
        publishedAt: new Date("2024-07-06"),
      },
      {
        title: "PHISHING CAMPAIGN TARGETS CORPORATE DEPARTMENTS",
        description: "A sophisticated phishing campaign is targeting corporate employees by sending emails that appear to be from human resources departments.",
        content: "The campaign uses advanced social engineering techniques...",
        source: "Bleeping Computer",
        category: "phishing", 
        tags: ["PHISHING", "SOCIAL ENGINEERING", "CREDENTIAL THEFT"],
        publishedAt: new Date("2024-07-13"),
      },
      {
        title: "MASSIVE DATA BREACH AT MAJOR RETAILER",
        description: "A leading retail chain has reported a data breach affecting millions of customer records, including credit card information and personal details.",
        content: "The breach was discovered during routine security monitoring...",
        source: "TechCrunch",
        category: "breach",
        tags: ["DATA BREACH", "CREDIT CARD FRAUD"],
        publishedAt: new Date("2023-10-29"),
      },
    ];

    await db.insert(newsArticles).values(seedNews);

    // Seed simulations
    const seedSimulations = [
      {
        name: "Phishing Email Response",
        description: "Learn to identify and respond to sophisticated phishing attempts targeting your organization.",
        type: "phishing",
        difficulty: "beginner",
        duration: 15,
        maxPoints: 100,
        instructions: "You will receive various emails. Identify which are legitimate and which are phishing attempts.",
        scenarios: {
          emails: [
            { id: 1, suspicious: true, indicators: ["urgent language", "suspicious sender"] },
            { id: 2, suspicious: false, indicators: ["known sender", "expected content"] },
          ],
        },
      },
      {
        name: "Network Intrusion Defense",
        description: "Detect and respond to network intrusion attempts using advanced monitoring tools.",
        type: "network-defense",
        difficulty: "intermediate",
        duration: 30,
        maxPoints: 200,
        instructions: "Monitor network traffic and identify potential intrusion attempts using provided tools.",
        scenarios: {
          networkEvents: [
            { id: 1, type: "port_scan", severity: "medium" },
            { id: 2, type: "data_exfiltration", severity: "high" },
          ],
        },
      },
      {
        name: "Incident Response Protocol",
        description: "Practice coordinated incident response procedures for a major security breach.",
        type: "incident-response", 
        difficulty: "expert",
        duration: 45,
        maxPoints: 300,
        instructions: "Follow established incident response procedures to contain and remediate a security incident.",
        scenarios: {
          incident: { type: "ransomware", scope: "enterprise-wide", timeline: "active" },
        },
      },
    ];

    await db.insert(simulations).values(seedSimulations);

    // Seed system metrics
    const seedMetrics = [
      {
        metricType: "system_health",
        value: 96,
        metadata: { components: ["firewall", "ids", "endpoint_protection"] },
      },
      {
        metricType: "ai_confidence", 
        value: 94,
        metadata: { model_version: "v2.1", training_data: "updated" },
      },
      {
        metricType: "threat_count",
        value: 5,
        metadata: { active: 3, analyzing: 1, resolved: 1 },
      },
    ];

    await db.insert(systemMetrics).values(seedMetrics);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();