import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ChatResponse {
  message: string;
  type: 'platform_help' | 'cybersecurity_info' | 'threat_analysis';
  confidence: number;
  sources?: string[];
}

export async function processChatMessage(message: string, context?: any): Promise<ChatResponse> {
  try {
    // Determine message intent
    const intent = await determineIntent(message);
    
    let systemPrompt = "";
    let responseType: ChatResponse['type'] = 'platform_help';
    
    switch (intent.type) {
      case 'platform_help':
        systemPrompt = `You are CyberSentinel AI, an intelligent assistant for a cybersecurity command center platform. 
        Help users navigate the platform, explain features, and provide guidance on using the threat monitoring, training simulations, 
        and reporting capabilities. Be concise and actionable. Respond in JSON format with fields: message, confidence.`;
        responseType = 'platform_help';
        break;
        
      case 'cybersecurity_info':
        systemPrompt = `You are CyberSentinel AI, a cybersecurity expert. Provide accurate, up-to-date information about 
        cybersecurity threats, best practices, and incident response. Include recent threat intelligence and recommendations. 
        Be technical but accessible. Respond in JSON format with fields: message, confidence, sources (array of strings).`;
        responseType = 'cybersecurity_info';
        break;
        
      case 'threat_analysis':
        systemPrompt = `You are CyberSentinel AI, specializing in threat analysis. Analyze the provided threat data or scenario 
        and provide detailed assessment including risk level, potential impact, and mitigation strategies. 
        Respond in JSON format with fields: message, confidence, sources.`;
        responseType = 'threat_analysis';
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "I'm here to help with your cybersecurity questions.",
      type: responseType,
      confidence: result.confidence || 0.8,
      sources: result.sources || [],
    };

  } catch (error) {
    console.error("OpenAI processing error:", error);
    return {
      message: "I'm experiencing technical difficulties. Please try again or contact support for assistance.",
      type: 'platform_help',
      confidence: 0.5,
    };
  }
}

async function determineIntent(message: string): Promise<{ type: string; confidence: number }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Analyze the user message and determine intent. Categories:
          - platform_help: Questions about using the CyberSentinel platform, navigation, features
          - cybersecurity_info: General cybersecurity questions, threat information, best practices  
          - threat_analysis: Requests to analyze specific threats, incidents, or security scenarios
          
          Respond with JSON: { "type": "category", "confidence": 0.0-1.0 }`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content || '{"type": "platform_help", "confidence": 0.5}');
  } catch (error) {
    return { type: "platform_help", confidence: 0.5 };
  }
}

export async function generateThreatSummary(threats: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Create a concise executive summary of current cybersecurity threats. Focus on key risks and recommendations."
        },
        {
          role: "user",
          content: `Analyze these threats and provide a summary: ${JSON.stringify(threats.slice(0, 10))}`
        }
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    return response.choices[0].message.content || "No threats currently detected.";
  } catch (error) {
    return "Unable to generate threat summary at this time.";
  }
}
