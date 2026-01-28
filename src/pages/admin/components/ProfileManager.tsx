import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Save, Upload } from "lucide-react";

export default function ProfileManager() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        headline: "",
        bio: "",
        hero_image_url: "",
        avatar_url: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 is "Rest contains 0 rows"
                console.error("Profile fetch error:", error);
            }
            if (data) setProfile(data);
        } catch (err: any) {
            console.error("Profile fetch error:", err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Assuming we use ID 1 for the singleton profile
            const { error } = await supabase
                .from('profiles')
                .upsert({ id: 1, ...profile });

            if (error) throw error;
            alert("Profile updated!");
        } catch (err: any) {
            alert("Error saving profile: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Helper */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800 mb-4 overflow-hidden">
                        {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />}
                    </div>
                    <label className="text-xs text-purple-400 font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                        <Upload size={14} className="inline mr-1" /> Upload Image
                        <input type="text" className="hidden" placeholder="Paste URL for now" />
                    </label>
                    <input
                        type="text"
                        placeholder="Avatar URL"
                        value={profile.avatar_url || ""}
                        onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                        className="mt-4 w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* Hero Image Helper */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-full h-24 bg-slate-800 mb-4 rounded-lg overflow-hidden relative">
                        {profile.hero_image_url && <img src={profile.hero_image_url} alt="Hero" className="w-full h-full object-cover" />}
                    </div>
                    <input
                        type="text"
                        placeholder="Hero Cover Image URL"
                        value={profile.hero_image_url || ""}
                        onChange={(e) => setProfile({ ...profile, hero_image_url: e.target.value })}
                        className="mt-4 w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Display Name</label>
                    <input
                        type="text"
                        value={profile.full_name || ""}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Headline / Role</label>
                    <input
                        type="text"
                        value={profile.headline || ""}
                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Bio</label>
                    <textarea
                        rows={4}
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-purple-400 hover:text-white transition-all disabled:opacity-50"
            >
                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
