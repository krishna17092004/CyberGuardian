import { Bot, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'platform_help' | 'cybersecurity_info' | 'threat_analysis';
  confidence?: number;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "CyberSentinel AI activated. How can I assist you with your security query?",
      isUser: false,
      timestamp: new Date(),
      type: 'platform_help',
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        userId: "current-user", // This would come from auth context in real app
        type: "general",
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: data.message,
          isUser: false,
          timestamp: new Date(),
          type: data.type,
          confidence: data.confidence,
        },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "I'm experiencing technical difficulties. Please try again or contact support for assistance.",
          isUser: false,
          timestamp: new Date(),
          type: 'platform_help',
        },
      ]);
    },
  });

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'cybersecurity_info': return 'bg-cyber-red';
      case 'threat_analysis': return 'bg-cyber-orange';
      case 'platform_help':
      default: return 'bg-cyber-cyan';
    }
  };

  return (
    <div className="bg-cyber-gray brutalist-border cyber-shadow">
      <div className="p-4 border-b-3 border-black bg-cyber-lighter">
        <h3 className="font-bold text-cyber-cyan flex items-center">
          <Bot className="mr-2" size={16} />
          CYBERSENTINEL AI
        </h3>
      </div>
      <div className="p-4">
        {/* Chat Messages */}
        <div className="h-48 overflow-y-auto space-y-3 mb-4" data-testid="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className={`p-3 brutalist-border ${
                msg.isUser 
                  ? "bg-cyber-magenta text-black ml-4" 
                  : `${getMessageTypeColor(msg.type)} text-black`
              }`}>
                <p className="text-xs font-bold">{msg.message}</p>
                {msg.confidence && (
                  <p className="text-xs opacity-75 mt-1">
                    Confidence: {Math.round(msg.confidence * 100)}%
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a security question..."
            className="flex-1 bg-cyber-dark brutalist-border text-white placeholder-gray-400 focus:border-cyber-cyan"
            data-testid="input-chat-message"
            disabled={chatMutation.isPending}
          />
          <button 
            onClick={sendMessage}
            disabled={chatMutation.isPending || !inputMessage.trim()}
            className="bg-cyber-cyan text-black px-3 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn disabled:opacity-50"
            data-testid="button-send-message"
          >
            {chatMutation.isPending ? (
              <div className="animate-spin">⟳</div>
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
