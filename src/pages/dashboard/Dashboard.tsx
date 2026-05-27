import { useAuth } from "../../contexts/AuthContext";
import { Vote, Users, BarChart3, Clock, ArrowUpRight, ArrowRight } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Active Polls", value: "12", icon: Vote, color: "text-brand-600", bg: "bg-brand-50 dark:bg-brand-900/20" },
        { label: "Total Votes", value: "842", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { label: "Participation", value: "68%", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    ];

    return (
        <div className="p-8 animate-page space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-[var(--text-heading)] tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-main)] mt-1 font-medium text-lg">
                        Welcome back, <span className="text-brand-600 dark:text-brand-500 font-bold">{user?.first_name}</span>! ✨
                    </p>
                </div>

                <div className="flex items-center space-x-2 text-sm font-bold px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] shadow-sm">
                    <Clock size={16} className="text-brand-600" />
                    <span>Updated just now</span>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-[var(--bg-surface)] rounded-[2rem] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-emerald-500 text-xs font-bold">
                                +12% <ArrowUpRight size={14} />
                            </span>
                        </div>
                        <p className="text-[var(--text-main)] font-semibold text-xs uppercase tracking-widest">{stat.label}</p>
                        <h2 className="text-3xl font-black text-[var(--text-heading)] mt-1">{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Polls */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-[var(--text-heading)]">Recent Polls</h3>
                        <button className="text-brand-600 dark:text-brand-400 font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="bg-[var(--bg-surface)] rounded-[2rem] border border-[var(--border-color)] overflow-hidden shadow-sm">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-6 border-b border-[var(--border-color)] last:border-0 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-[var(--text-heading)] group-hover:text-brand-600 transition-colors">
                                            Best Frontend Framework for 2026?
                                        </h4>
                                        <p className="text-xs text-[var(--text-main)]">Ends in 3 days • 154 participants</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase">
                                            Active
                                        </span>
                                        <ArrowRight size={16} className="text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature CTA */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-heading)] px-2">Action Center</h3>
                    <div className="bg-brand-600 rounded-[2rem] p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black italic">MAKE YOUR VOICE HEARD</h4>
                            <p className="text-brand-100 text-sm mt-3 leading-relaxed font-medium">
                                You have <span className="font-black text-white underline decoration-2 underline-offset-4">4 pending ballots</span> that require your immediate attention.
                            </p>
                            <button className="mt-8 w-full py-4 bg-white text-brand-600 font-black rounded-2xl hover:bg-brand-50 transition-all shadow-lg hover:scale-[1.02] active:scale-95">
                                OPEN BALLOTS
                            </button>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}