import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Trash2, Edit3, ExternalLink, Github } from "lucide-react";

export default function ProjectManager() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>({
        title: "",
        description: "",
        image_url: "",
        year: new Date().getFullYear().toString(),
        tools: "", // managed as string for input
        live_link: "",
        github_link: "",
        category: "Full Stack"
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setProjects(data);
        } catch (err: any) {
            console.error("Fetch errors:", err);
            // alert("Failed to fetch projects");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        const payload = {
            ...currentProject,
            tools: typeof currentProject.tools === 'string'
                ? currentProject.tools.split(',').map((t: string) => t.trim())
                : currentProject.tools
        };
        const { id, ...upsertData } = payload;

        try {
            if (currentProject.id) {
                const { error } = await supabase
                    .from('projects')
                    .update(upsertData)
                    .eq('id', currentProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert(upsertData);
                if (error) throw error;
            }
            fetchProjects();
            setIsEditing(false);
            resetForm();
        } catch (err: any) {
            alert("Error saving: " + err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this project?")) return;
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const startEdit = (project: any) => {
        setCurrentProject({
            ...project,
            tools: Array.isArray(project.tools) ? project.tools.join(', ') : project.tools
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentProject({
            title: "",
            description: "",
            image_url: "",
            year: new Date().getFullYear().toString(),
            tools: "",
            live_link: "",
            github_link: "",
            category: "Full Stack"
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Mission Logs (Projects)</h3>
                {!isEditing && (
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus size={16} /> New Project
                    </button>
                )}
            </div>

            {/* Editor */}
            {isEditing && (
                <div className="bg-[#0F172A] border border-white/10 p-8 rounded-2xl mb-8 animate-in slide-in-from-top-4">
                    <h4 className="text-white font-bold mb-6">{currentProject.id ? 'Edit Project' : 'New Project'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <input
                                placeholder="Project Title"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={currentProject.title}
                                onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                rows={4}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={currentProject.description}
                                onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                            />
                            <input
                                placeholder="Tech Stack (comma separated: React, Node, AWS)"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={currentProject.tools}
                                onChange={e => setCurrentProject({ ...currentProject, tools: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <input
                                placeholder="Cover Image URL"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={currentProject.image_url}
                                onChange={e => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                            />
                            {currentProject.image_url && (
                                <div className="h-32 w-full rounded-lg overflow-hidden border border-white/5 bg-black">
                                    <img src={currentProject.image_url} className="w-full h-full object-cover opacity-50" alt="Preview" />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Live Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                    value={currentProject.live_link}
                                    onChange={e => setCurrentProject({ ...currentProject, live_link: e.target.value })}
                                />
                                <input
                                    placeholder="GitHub Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                    value={currentProject.github_link}
                                    onChange={e => setCurrentProject({ ...currentProject, github_link: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button onClick={handleSave} className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-slate-200">Save Mission</button>
                    </div>
                </div>
            )}

            {/* Table List */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs font-mono text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-4">Project</th>
                            <th className="p-4">Tech</th>
                            <th className="p-4">Links</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projects.map((p) => (
                            <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-slate-800 overflow-hidden">
                                            {p.image_url && <img src={p.image_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <span className="font-bold text-white">{p.title}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-400 max-w-xs truncate">
                                    {Array.isArray(p.tools) ? p.tools.join(', ') : p.tools}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {p.live_link && <a href={p.live_link} target="_blank" className="text-slate-500 hover:text-white"><ExternalLink size={14} /></a>}
                                        {p.github_link && <a href={p.github_link} target="_blank" className="text-slate-500 hover:text-white"><Github size={14} /></a>}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No projects found in database.</div>
                )}
            </div>
        </div>
    );
}
