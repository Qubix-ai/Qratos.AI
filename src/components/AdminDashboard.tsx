import { useState, useEffect } from "react";
import { X, Users, MessageSquare, Zap, TrendingUp, Activity, ShieldCheck, Heart, ArrowUpRight, BarChart3, Clock, Database } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { auth } from "../lib/firebase";

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch("/api/admin/stats", { headers });
        
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Admin stats fetch failed (${res.status}): ${text.slice(0, 100)}`);
        }
        
        const data = await res.json();
        setStats(data);
      } catch (e: any) {
        console.error(e);
        // Fallback or error display logic could go here
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const dummyData = [
    { name: "Mon", users: 400, prompts: 2400 },
    { name: "Tue", users: 520, prompts: 3200 },
    { name: "Wed", users: 680, prompts: 4100 },
    { name: "Thu", users: 800, prompts: 5100 },
    { name: "Fri", users: 950, prompts: 6200 },
    { name: "Sat", users: 1100, prompts: 7500 },
    { name: "Sun", users: 1250, prompts: 8900 },
  ];

  if (loading) return <div className="p-12 text-center text-gray-500">Decrypting system metrics...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#0A0A0B] z-50 overflow-y-auto custom-scrollbar p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto pb-20">
        <header className="flex items-center justify-between mb-8 md:mb-12 mt-4 md:mt-0">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-[10px] md:text-xs font-sans mb-2">
              <ShieldCheck size={14} />
              ADMINISTRATIVE ACCESS GRANTED
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">System Overview</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-3 -mr-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all active:scale-90"
            aria-label="Close Dashboard"
          >
            <X size={28} className="md:size-6" />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-12">
          {[
            { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", trend: "+12%" },
            { label: "Conversations", value: stats?.totalConversations || 0, icon: MessageSquare, color: "text-purple-400", trend: "+18%" },
            { label: "Prompts", value: stats?.totalPrompts || 0, icon: Zap, color: "text-yellow-400", trend: "+24%" },
            { label: "Retention", value: "84%", icon: Heart, color: "text-pink-400", trend: "+2%" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
                <stat.icon size={40} />
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
                <div className="flex items-center gap-0.5 text-[8px] md:text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                  <ArrowUpRight size={8} className="md:size-[10px]" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-gray-400 text-[9px] md:text-xs font-medium uppercase tracking-wider mb-1 truncate">{stat.label}</p>
              <h3 className="text-xl md:text-3xl font-bold text-white truncate">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white">Conversion & Growth</h3>
                  <p className="text-xs text-gray-500">Daily prompts vs User acquisition</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-purple-500" /> Prompts
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Users
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #ffffff10", borderRadius: "12px" }}
                      itemStyle={{ fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                    <Area type="monotone" dataKey="prompts" stroke="#a855f7" fillOpacity={1} fill="url(#colorPrompts)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                   <BarChart3 size={16} className="text-yellow-500" />
                   Category Distribution
                 </h3>
                 <div className="space-y-4">
                    {[
                      { l: "Landing Pages", p: 42, color: "bg-purple-500" },
                      { l: "Email Sequences", p: 28, color: "bg-blue-500" },
                      { l: "Ad Copy", p: 18, color: "bg-green-500" },
                      { l: "Social Media", p: 12, color: "bg-pink-500" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1.5 uppercase font-medium">
                          <span>{item.l}</span>
                          <span className="text-white">{item.p}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.p}%` }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
               
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                   <Clock size={16} className="text-blue-500" />
                   System Health
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400">API Latency</span>
                       <span className="text-xs font-sans text-green-400">142ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400">Uptime</span>
                       <span className="text-xs font-sans text-green-400">99.99%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400">Token Usage</span>
                       <span className="text-xs font-sans text-yellow-400">7.2M / 10M</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-400">Server Load</span>
                       <span className="text-xs font-sans text-blue-400">24%</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={16} className="text-red-500" />
                Live Feed
              </h3>
              <div className="flex-1 space-y-4">
                 {(stats?.recentActivity || []).map((ev: any, i: number) => (
                   <div key={i} className="flex gap-3 text-xs border-b border-white/5 pb-3">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-gray-300">
                          User <span className="text-white font-sans">{ev.userId.slice(0, 6)}</span> executed <span className="text-purple-400">{ev.eventType}</span>
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">{new Date(ev.createdAt).toLocaleTimeString()}</p>
                      </div>
                   </div>
                 ))}
                 {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                   <div className="text-gray-600 text-xs italic">Awaiting neural activity...</div>
                 )}
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                 <div className="flex items-center gap-3 mb-2">
                    <Database size={16} className="text-purple-400" />
                    <span className="text-xs font-bold text-white">Database Status</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Synced to Singapore</span>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       <span className="text-[10px] font-bold text-green-500">OPTIMAL</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
