import { Users, UserPlus, Edit, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface Operative {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  lastActive: string;
  createdAt: string;
}

const mockOperatives: Operative[] = [
  {
    id: "1",
    username: "KRISHNA",
    email: "kjb2w2024@gmail.com",
    role: "admin",
    status: "active",
    lastActive: "2 min ago",
    createdAt: "Jan 2024",
  },
  {
    id: "2",
    username: "ALEX THOMPSON",
    email: "alex.thompson@cybersentinel.ai",
    role: "analyst",
    status: "active",
    lastActive: "1 hour ago",
    createdAt: "Mar 2024",
  },
  {
    id: "3",
    username: "SARAH CHEN",
    email: "sarah.chen@cybersentinel.ai",
    role: "operator",
    status: "active",
    lastActive: "30 min ago",
    createdAt: "Feb 2024",
  },
  {
    id: "4",
    username: "MIKE JOHNSON",
    email: "mike.johnson@cybersentinel.ai",
    role: "analyst",
    status: "suspended",
    lastActive: "2 days ago",
    createdAt: "Jan 2024",
  },
];

export default function Operatives() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: operatives = mockOperatives } = useQuery({
    queryKey: ["/api/users"],
    enabled: false, // Using mock data for now
  });

  const stats = {
    totalUsers: 127,
    activeUsers: 98,
    adminUsers: 12,
    suspendedUsers: 3,
  };

  const filteredOperatives = (operatives as Operative[]).filter((op: Operative) => {
    const matchesSearch = !searchTerm || 
      op.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || op.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-cyber-magenta text-black";
      case "analyst": return "bg-cyber-blue text-white";
      case "operator": return "bg-cyber-green text-black";
      default: return "bg-cyber-gray text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-cyber-green text-black";
      case "suspended": return "bg-cyber-red text-white";
      case "inactive": return "bg-cyber-yellow text-black";
      default: return "bg-cyber-gray text-white";
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-cyber-magenta";
      case "analyst": return "bg-cyber-blue";
      case "operator": return "bg-cyber-orange";
      default: return "bg-cyber-cyan";
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 asymmetric-offset">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-cyber-magenta flex items-center">
            <Users className="mr-3" size={28} />
            OPERATIVES
          </h1>
          <p className="text-sm text-gray-400 mt-1">USER ACCESS MANAGEMENT</p>
        </div>
        <button 
          className="bg-cyber-cyan text-black px-4 py-2 brutalist-border cyber-shadow font-bold text-sm neo-brutal-btn"
          data-testid="button-invite-operative"
        >
          <UserPlus className="mr-2" size={14} />
          INVITE OPERATIVE
        </button>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-cyber-green brutalist-border cyber-shadow p-4" data-testid="stat-total-users">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{stats.totalUsers}</div>
            <div className="text-xs font-bold text-black">TOTAL OPERATIVES</div>
          </div>
        </div>
        <div className="bg-cyber-cyan brutalist-border cyber-shadow p-4" data-testid="stat-active-users">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{stats.activeUsers}</div>
            <div className="text-xs font-bold text-black">ACTIVE USERS</div>
          </div>
        </div>
        <div className="bg-cyber-orange brutalist-border cyber-shadow p-4" data-testid="stat-admin-users">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{stats.adminUsers}</div>
            <div className="text-xs font-bold text-black">ADMINISTRATORS</div>
          </div>
        </div>
        <div className="bg-cyber-red brutalist-border cyber-shadow p-4" data-testid="stat-suspended-users">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.suspendedUsers}</div>
            <div className="text-xs font-bold text-white">SUSPENDED</div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-cyber-gray brutalist-border cyber-shadow">
        <div className="p-4 border-b-3 border-black bg-cyber-lighter">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-cyber-magenta">OPERATIVE DIRECTORY</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="SEARCH OPERATIVES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-cyber-dark brutalist-border text-white placeholder-gray-400"
                data-testid="input-search-operatives"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-cyber-dark brutalist-border text-white min-w-[120px]" data-testid="select-role-filter">
                  <SelectValue placeholder="ALL ROLES" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ALL ROLES</SelectItem>
                  <SelectItem value="admin">ADMIN</SelectItem>
                  <SelectItem value="analyst">ANALYST</SelectItem>
                  <SelectItem value="operator">OPERATOR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4" data-testid="operatives-list">
            {filteredOperatives.map((operative: Operative) => (
              <div key={operative.id} className="bg-cyber-dark brutalist-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getAvatarColor(operative.role)} brutalist-border flex items-center justify-center`}>
                      <Users className="text-black text-lg" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{operative.username}</h4>
                      <p className="text-sm text-gray-400">{operative.email}</p>
                      <div className="flex space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-bold brutalist-border ${getRoleColor(operative.role)}`}>
                          {operative.role.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-bold brutalist-border ${getStatusColor(operative.status)}`}>
                          {operative.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div>
                      <p>LAST ACTIVE</p>
                      <p className="text-white">{operative.lastActive}</p>
                    </div>
                    <div>
                      <p>JOINED</p>
                      <p className="text-white">{operative.createdAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="bg-cyber-blue text-white p-2 brutalist-border cyber-shadow neo-brutal-btn"
                        data-testid={`button-edit-${operative.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="bg-cyber-red text-white p-2 brutalist-border cyber-shadow neo-brutal-btn"
                        data-testid={`button-suspend-${operative.id}`}
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6" data-testid="pagination">
            <span className="text-sm text-gray-400">Showing 1-{filteredOperatives.length} of {stats.totalUsers} operatives</span>
            <div className="flex space-x-2">
              <button className="bg-cyber-gray brutalist-border px-3 py-2 text-sm font-bold hover:bg-cyber-lighter">PREV</button>
              <button className="bg-cyber-cyan text-black brutalist-border px-3 py-2 text-sm font-bold">1</button>
              <button className="bg-cyber-gray brutalist-border px-3 py-2 text-sm font-bold hover:bg-cyber-lighter">2</button>
              <button className="bg-cyber-gray brutalist-border px-3 py-2 text-sm font-bold hover:bg-cyber-lighter">3</button>
              <button className="bg-cyber-gray brutalist-border px-3 py-2 text-sm font-bold hover:bg-cyber-lighter">NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
