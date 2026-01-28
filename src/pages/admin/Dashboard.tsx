import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
    FolderKanban, User, Award, LogOut, Save, Trash2, Plus, Loader2, Link as LinkIcon
} from "lucide-react";
import CertificationsManager from "./components/CertificationsManager";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);

    // DATA STATES
    const [profile, setProfile] = useState({
        display_name: "",
        headline: "",
        about_text: "",
        avatar_url: ""
    });

    // INITIAL LOAD
    useEffect(() => {
        fetchProfile();
    }, []);

    // --- FETCHING ---
    async function fetchProfile() {
        const { data } = await supabase.from('profile').select('*').limit(1).single();
        if (data) setProfile(data);
    }

    // --- ACTIONS ---
    async function handleUpdateProfile() {
        setLoading(true);
        try {
            // First, check if a profile exists
            const { data: existingProfile } = await supabase
                .from('profile')
                .select('id')
                .limit(1)
                .single();

            if (existingProfile) {
                // Update existing profile
                const { error } = await supabase
                    .from('profile')
                    .update(profile)
                    .eq('id', existingProfile.id);
                
                if (error) throw error;
            } else {
                // Insert new profile
                const { error } = await supabase
                    .from('profile')
                    .insert([profile]);
                
                if (error) throw error;
            }
            
            alert("✓ Profile Updated Successfully!");
            fetchProfile(); // Refresh the data
        } catch (error: any) {
            alert("Error saving profile: " + error.message);
            console.error("Profile update error:", error);
        }
        setLoading(false);
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans flex">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col justify-between fixed h-full bg-black z-10">
                <div>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold">V</div>
                        <span className="text-white font-bold tracking-wide">VOID ADMIN</span>
                    </div>
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <User size={18} /> Profile & Bio
                        </button>
                        <button onClick={() => setActiveTab("certs")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'certs' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                            <Award size={18} /> Certifications
                        </button>
                        {/* Add Projects tab back if needed */}
                    </nav>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400">
                    <LogOut size={18} /> Disconnect
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-64 p-8 md:p-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2 capitalize">{activeTab === 'certs' ? 'Certifications' : 'Profile Settings'}</h1>
                    <p className="text-slate-500">System Control Panel /// v2.4.0</p>
                </header>

                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl space-y-6">
                        <div className="bg-white/5 border border-white/5 p-8 rounded-3xl">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Display Name</label>
                                    <input
                                        value={profile.display_name || ''}
                                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Headline / Role</label>
                                    <input
                                        value={profile.headline || ''}
                                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">About Text</label>
                                    <textarea
                                        rows={4}
                                        value={profile.about_text || ''}
                                        onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Avatar URL</label>
                                    <div className="flex gap-4">
                                        <div className="h-14 w-14 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                                            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />}
                                        </div>
                                        <input
                                            value={profile.avatar_url || ''}
                                            onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                                            placeholder="https://..."
                                            className="flex-1 bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="mt-6 bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- CERTIFICATIONS TAB --- */}
                {activeTab === 'certs' && (
                    <div className="max-w-6xl">
                        <CertificationsManager />
                    </div>
                )}

            </main>
        </div>
    );
}
