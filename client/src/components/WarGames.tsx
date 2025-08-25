import { Gamepad2, Play } from "lucide-react";

interface Simulation {
  id: string;
  name: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  duration: number;
  maxPoints: number;
  color: string;
  textColor: string;
}

const simulations: Simulation[] = [
  {
    id: "phishing-detection",
    name: "PHISHING EMAIL DETECTION",
    description: "Learn to identify and respond to phishing attempts in realistic email scenarios",
    type: "phishing",
    difficulty: "beginner",
    duration: 15,
    maxPoints: 100,
    color: "bg-cyber-green",
    textColor: "text-black",
  },
  {
    id: "network-defense",
    name: "NETWORK DEFENSE CHALLENGE",
    description: "Defend against multi-vector cyber attacks using advanced security tools",
    type: "network-defense",
    difficulty: "expert",
    duration: 60,
    maxPoints: 500,
    color: "bg-cyber-red",
    textColor: "text-white",
  },
  {
    id: "incident-response",
    name: "INCIDENT RESPONSE DRILL",
    description: "Coordinate response to a simulated cyber attack following industry best practices",
    type: "incident-response",
    difficulty: "intermediate",
    duration: 30,
    maxPoints: 180,
    color: "bg-cyber-yellow",
    textColor: "text-black",
  },
  {
    id: "malware-analysis",
    name: "MALWARE ANALYSIS LAB",
    description: "Analyze suspicious files and network traffic to identify malware signatures",
    type: "malware-analysis",
    difficulty: "intermediate",
    duration: 45,
    maxPoints: 250,
    color: "bg-cyber-orange",
    textColor: "text-black",
  },
];

export default function WarGames() {
  const launchSimulation = (simulationId: string) => {
    // Implementation would start the simulation
    console.log(`Launching simulation: ${simulationId}`);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-green flex items-center">
            <Gamepad2 className="mr-3" size={28} />
            WAR GAMES
          </h1>
          <p className="text-sm text-gray-400 mt-1">TACTICAL TRAINING SIMULATIONS</p>
        </div>
      </div>

      {/* Training Simulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {simulations.map((sim) => (
          <div key={sim.id} className={`${sim.color} brutalist-border cyber-shadow`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${sim.textColor} text-xl`}>{sim.name}</h3>
                <span className={`bg-cyber-dark px-3 py-1 text-xs font-bold brutalist-border ${
                  sim.difficulty === 'beginner' ? 'text-cyber-green' :
                  sim.difficulty === 'intermediate' ? 'text-cyber-yellow' : 'text-cyber-red'
                }`}>
                  {sim.difficulty.toUpperCase()}
                </span>
              </div>
              <p className={`${sim.textColor} text-sm mb-6`}>{sim.description}</p>
              
              {/* Simulation Preview */}
              <div className="bg-cyber-dark brutalist-border h-32 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark via-cyber-gray to-cyber-dark opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-6xl ${sim.textColor === 'text-black' ? 'text-white' : 'text-cyber-cyan'}`}>
                    {sim.type === 'phishing' && '📧'}
                    {sim.type === 'network-defense' && '🛡️'}
                    {sim.type === 'incident-response' && '🚨'}
                    {sim.type === 'malware-analysis' && '🔍'}
                  </div>
                </div>
              </div>
              
              <div className={`flex justify-between items-center mb-4 text-sm ${sim.textColor}`}>
                <span>Time: <strong>{sim.duration} min</strong></span>
                <span>Points: <strong>{sim.maxPoints} pts</strong></span>
              </div>
              
              <button 
                onClick={() => launchSimulation(sim.id)}
                className="w-full bg-cyber-cyan text-black py-3 brutalist-border cyber-shadow font-bold neo-brutal-btn"
                data-testid={`button-launch-${sim.id}`}
              >
                <Play className="mr-2" size={16} />
                LAUNCH
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Progress */}
      <div className="bg-cyber-gray brutalist-border cyber-shadow p-6">
        <h3 className="font-bold text-cyber-cyan text-xl mb-4">YOUR PROGRESS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="user-progress">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-green">1,250</div>
            <div className="text-sm text-gray-400">TOTAL POINTS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-yellow">8</div>
            <div className="text-sm text-gray-400">SIMULATIONS COMPLETED</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-magenta">EXPERT</div>
            <div className="text-sm text-gray-400">CURRENT RANK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
