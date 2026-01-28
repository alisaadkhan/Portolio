import {
    LayoutDashboard,
    FolderKanban,
    Zap,
    LogOut,
    UserCircle,
    Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Components
import ProfileManager from "./components/ProfileManager";
import SkillsManager from "./components/SkillsManager";
import ProjectManager from "./components/ProjectManager";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session) {
                    navigate("/admin/login");
                } else {
                    setUser(session.user);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate("/admin/login");
        } else {
            setUser(session.user);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileManager />;
            case 'skills': return <SkillsManager />;
            case 'projects': return <ProjectManager />;
            default: return (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome, Operator.</h2>
                    <p className="text-slate-400">Select a module from the sidebar to begin system management.</p>
                </div>
            );
        }
    };

    const NavItem = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col justify-between fixed h-full bg-[#020617]">
                <div>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">V</div>
                        <span className="text-white font-bold tracking-tight">VOID ADMIN</span>
                    </div>

                    <nav className="space-y-1">
                        <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
                        <div className="pt-4 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4">Modules</span>
                        </div>
                        <NavItem id="profile" label="Profile & Bio" icon={UserCircle} />
                        <NavItem id="skills" label="Skill Arsenal" icon={Zap} />
                        <NavItem id="projects" label="Mission Logs" icon={FolderKanban} />
                        <div className="pt-4 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4">System</span>
                        </div>
                        <NavItem id="settings" label="Settings" icon={Settings} />
                    </nav>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate w-32">{user?.email}</div>
                            <div className="text-[10px] text-green-400">● Online</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} /> Disconnect
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 md:ml-64 p-8 md:p-12 bg-grid-white/[0.02]">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 capitalize tracking-tight">
                            {activeTab.replace('-', ' ')}
                        </h1>
                        <p className="text-slate-500 text-sm">System Control Panel /// v2.4.0</p>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
