import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Save, Upload } from "lucide-react";
import ImageUpload from "./ImageUpload";

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
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: 1, ...profile })
                .select();

            if (error) throw error;
            
            console.log("Admin Update Success:", data);
            
            alert("Profile updated!");
        } catch (err: any) {
            console.error("Profile Save Error:", err);
            alert("Error saving profile: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <ImageUpload
                    currentUrl={profile.avatar_url || ""}
                    onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
                    folder="profile"
                    label="Avatar Image"
                />

                {/* Hero Image Upload */}
                <ImageUpload
                    currentUrl={profile.hero_image_url || ""}
                    onUploadComplete={(url) => setProfile({ ...profile, hero_image_url: url })}
                    folder="profile"
                    label="Hero Cover Image"
                />
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
