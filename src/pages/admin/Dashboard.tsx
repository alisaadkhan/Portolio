import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
    FolderKanban, User, Award, LogOut, Save, Trash2, Plus, Loader2, Link as LinkIcon
} from "lucide-react";

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
    const [certs, setCerts] = useState<any[]>([]);
    const [newCertUrl, setNewCertUrl] = useState("");

    // INITIAL LOAD
    useEffect(() => {
        fetchProfile();
        fetchCerts();
    }, []);

    // --- FETCHING ---
    async function fetchProfile() {
        const { data } = await supabase.from('profile').select('*').limit(1).single();
        if (data) setProfile(data);
    }

    async function fetchCerts() {
        const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
        if (data) setCerts(data);
    }

    // --- ACTIONS ---
    async function handleUpdateProfile() {
        setLoading(true);
        // Update the single profile row (ID 1 usually, or generic update)
        const { error } = await supabase.from('profile').update(profile).gt('id', 0);
        setLoading(false);
        if (error) alert("Error saving profile: " + error.message);
        else alert("Profile Updated!");
    }

    async function handleAddCert() {
        if (!newCertUrl) return;
        const { error } = await supabase.from('certifications').insert([{ image_url: newCertUrl }]);
        if (error) {
            alert("Error: " + error.message);
        } else {
            setNewCertUrl("");
            fetchCerts();
        }
    }

    async function handleDeleteCert(id: number) {
        await supabase.from('certifications').delete().eq('id', id);
        fetchCerts();
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
                    <div className="max-w-4xl">
                        {/* Add New */}
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mb-8 flex gap-4">
                            <input
                                value={newCertUrl}
                                onChange={(e) => setNewCertUrl(e.target.value)}
                                placeholder="Paste Image URL here..."
                                className="flex-1 bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none"
                            />
                            <button onClick={handleAddCert} className="bg-purple-600 text-white font-bold px-6 rounded-xl hover:bg-purple-700">
                                <Plus />
                            </button>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {certs.map((cert) => (
                                <div key={cert.id} className="group relative aspect-video bg-black rounded-xl border border-white/10 overflow-hidden">
                                    <img src={cert.image_url} alt="Cert" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        onClick={() => handleDeleteCert(cert.id)}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
