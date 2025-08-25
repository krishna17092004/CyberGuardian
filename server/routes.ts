import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { processChatMessage } from "./openai";
import { insertThreatSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe') {
          // Handle subscription to real-time updates
          ws.send(JSON.stringify({ type: 'subscribed', data: 'Connected to real-time feed' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // API Routes

  // Dashboard metrics
  app.get('/api/metrics', async (req, res) => {
    try {
      const metrics = await storage.getLatestMetrics();
      const threatStats = await storage.getThreatStats();
      
      res.json({
        ...metrics,
        threatStats,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Threats
  app.get('/api/threats', async (req, res) => {
    try {
      const { status, severity, type } = req.query;
      const threats = await storage.getThreats({
        status: status as string,
        severity: severity as string,
        type: type as string,
      });
      res.json(threats);
    } catch (error) {
      console.error("Error fetching threats:", error);
      res.status(500).json({ message: "Failed to fetch threats" });
    }
  });

  app.post('/api/threats', async (req, res) => {
    try {
      const threatData = insertThreatSchema.parse(req.body);
      const threat = await storage.createThreat(threatData);
      
      // Broadcast new threat to connected clients
      broadcast({ type: 'new_threat', data: threat });
      
      res.json(threat);
    } catch (error) {
      console.error("Error creating threat:", error);
      res.status(400).json({ message: "Failed to create threat" });
    }
  });

  app.get('/api/threats/:id', async (req, res) => {
    try {
      const threat = await storage.getThreat(req.params.id);
      if (!threat) {
        return res.status(404).json({ message: "Threat not found" });
      }
      res.json(threat);
    } catch (error) {
      console.error("Error fetching threat:", error);
      res.status(500).json({ message: "Failed to fetch threat" });
    }
  });

  app.patch('/api/threats/:id', async (req, res) => {
    try {
      const threat = await storage.updateThreat(req.params.id, req.body);
      
      // Broadcast threat update
      broadcast({ type: 'threat_updated', data: threat });
      
      res.json(threat);
    } catch (error) {
      console.error("Error updating threat:", error);
      res.status(500).json({ message: "Failed to update threat" });
    }
  });

  // News articles
  app.get('/api/news', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const articles = await storage.getNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Simulations
  app.get('/api/simulations', async (req, res) => {
    try {
      const simulations = await storage.getSimulations();
      res.json(simulations);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });

  app.post('/api/simulations/:id/start', async (req, res) => {
    try {
      const { userId } = req.body;
      
      const userSimulation = await storage.createUserSimulation({
        userId,
        simulationId: req.params.id,
      });
      
      res.json(userSimulation);
    } catch (error) {
      console.error("Error starting simulation:", error);
      res.status(500).json({ message: "Failed to start simulation" });
    }
  });

  // Users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userId, type } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ message: "Message and userId required" });
      }

      // Process message with OpenAI
      const aiResponse = await processChatMessage(message);
      
      // Save chat message
      const chatMessage = await storage.createChatMessage({
        userId,
        message,
        response: aiResponse.message,
        type: aiResponse.type,
        metadata: { confidence: aiResponse.confidence, sources: aiResponse.sources },
      });
      
      res.json({
        id: chatMessage.id,
        message: aiResponse.message,
        type: aiResponse.type,
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/:userId', async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // System metrics updates (for simulation)
  app.post('/api/metrics/update', async (req, res) => {
    try {
      const { type, value } = req.body;
      
      const metric = await storage.createSystemMetric({
        metricType: type,
        value,
      });
      
      // Broadcast metric update
      broadcast({ type: 'metric_updated', data: { type, value } });
      
      res.json(metric);
    } catch (error) {
      console.error("Error updating metric:", error);
      res.status(500).json({ message: "Failed to update metric" });
    }
  });

  // External news integration (placeholder for news API)
  app.post('/api/news/fetch', async (req, res) => {
    try {
      // This would integrate with external news APIs like NewsAPI
      // For now, return success message
      res.json({ message: "News fetch initiated" });
    } catch (error) {
      console.error("Error fetching external news:", error);
      res.status(500).json({ message: "Failed to fetch external news" });
    }
  });

  return httpServer;
}
