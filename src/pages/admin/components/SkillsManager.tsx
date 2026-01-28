import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { toast } from "@/components/ui/sonner";
import { Trash2, Plus, Sparkles } from "lucide-react";

export default function SkillsManager() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: "",
        type: "tech_stack",
        slug: "", // SimpleIcons slug
        icon_name: "",
        image_url: "",
        brand_color: "#ffffff"
    });
    const [previewIcon, setPreviewIcon] = useState("");

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (data) setSkills(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Auto-generate icon URL from slug
    const handleSlugChange = (slug: string) => {
        const cleanSlug = slug.toLowerCase().trim();
        setNewSkill({ 
            ...newSkill, 
            slug: cleanSlug,
            image_url: cleanSlug ? `https://cdn.simpleicons.org/${cleanSlug}` : ""
        });
        setPreviewIcon(cleanSlug ? `https://cdn.simpleicons.org/${cleanSlug}` : "");
    };

    const handleAdd = async () => {
        if (!newSkill.name || !newSkill.slug) {
            toast.error("Missing Fields", { description: "Name and slug are required" });
            return;
        }
        try {
            const skillData = {
                name: newSkill.name,
                type: newSkill.type,
                icon_name: newSkill.slug,
                image_url: `https://cdn.simpleicons.org/${newSkill.slug}`,
                brand_color: newSkill.brand_color || "#ffffff"
            };

            const { data, error } = await supabase
                .from('skills')
                .insert(skillData)
                .select()
                .single();

            if (error) throw error;
            setSkills([...skills, data]);
            toast.success("Skill Added", { description: `${newSkill.name} has been added to your arsenal` });
            setIsAdding(false);
            setNewSkill({ name: "", type: "tech_stack", slug: "", icon_name: "", image_url: "", brand_color: "#ffffff" });
            setPreviewIcon("");
        } catch (err: any) {
            toast.error("Error", { description: err.message });
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Delete ${name}?`)) return;
        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSkills(skills.filter(s => s.id !== id));
            toast.success("Skill Removed", { description: `${name} has been deleted` });
        } catch (err: any) {
            toast.error("Error", { description: err.message });
        }
    };

    // Helper to render icon preview
    const renderIcon = (skill: any) => {
        if (skill.image_url) return <img src={skill.image_url} alt={skill.name} className="w-6 h-6 object-contain" />;
        return <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-[10px]">{skill.name[0]}</div>;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Skill Arsenal</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-start gap-2 text-sm text-purple-300">
                        <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <strong>Auto-Magic Mode:</strong> Just enter the slug (e.g., "react", "typescript", "figma") and the icon will be fetched automatically from SimpleIcons CDN.
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Skill Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. React"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={newSkill.name}
                                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">SimpleIcons Slug *</label>
                            <input
                                type="text"
                                placeholder="e.g. react, typescript, figma"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={newSkill.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Type</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={newSkill.type}
                                onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
                            >
                                <option value="tech_stack">Tech Stack (Grid)</option>
                                <option value="core">Core Competency (List)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Icon Preview</label>
                            <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-lg px-4 py-3 h-[46px]">
                                {previewIcon ? (
                                    <img src={previewIcon} alt="Preview" className="w-6 h-6" onError={() => setPreviewIcon("")} />
                                ) : (
                                    <div className="w-6 h-6 bg-slate-700 rounded" />
                                )}
                                <span className="text-xs text-slate-500">Auto-generated from slug</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => { setIsAdding(false); setPreviewIcon(""); }} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button onClick={handleAdd} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-slate-200 flex items-center gap-2">
                            <Sparkles size={16} /> Save Skill
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skills.map((skill) => (
                    <div key={`skill-${skill.id}`} className="group relative bg-[#020617] border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-colors">
                        <div className="relative">
                            {renderIcon(skill)}
                        </div>
                        <span className="text-sm font-medium text-slate-300">{skill.name}</span>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(skill.id, skill.name)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-slate-600">
                            {skill.type === 'core' ? 'CORE' : 'TECH'}
                        </div>
                    </div>
                ))}
                            onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
                        >
                            <option value="tech_stack">Tech Stack (Grid)</option>
                            <option value="core">Core Competency (List)</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Image URL (CDN)"
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                            value={newSkill.image_url}
                            onChange={(e) => setNewSkill({ ...newSkill, image_url: e.target.value })}
                        />
                        <input
                            type="color"
                            className="h-[46px] w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-white focus:border-purple-500 outline-none cursor-pointer"
                            value={newSkill.brand_color}
                            onChange={(e) => setNewSkill({ ...newSkill, brand_color: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button onClick={handleAdd} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-slate-200">Save Skill</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="group relative bg-[#020617] border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-colors">
                        <div className="relative">
                            {renderIcon(skill)}
                        </div>
                        <span className="text-sm font-medium text-slate-300">{skill.name}</span>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-slate-600">
                            {skill.type === 'core' ? 'CORE' : 'TECH'}
                        </div>
                    </div>
                ))}
            </div>
            {skills.length === 0 && !loading && (
                <div className="text-center text-slate-500 py-10">No skills found. Initialize the database!</div>
            )}
        </div>
    );
}
