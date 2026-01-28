import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Trash2, X, ExternalLink, Github, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Project {
    id?: number;
    title: string;
    description: string;
    image_url: string;
    year: string;
    competencies: string[]; // Core competencies (text pills)
    tools: string[]; // Tech stack (SimpleIcon slugs)
    live_link: string;
    github_link: string;
    is_featured: boolean;
    position: number;
}

export default function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Tag input states
    const [competencyInput, setCompetencyInput] = useState("");
    const [toolInput, setToolInput] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('position', { ascending: true });

            if (error) throw error;
            if (data) {
                setProjects(data);
                if (data.length > 0 && !selectedProject) {
                    setSelectedProject(data[0]);
                }
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
        }
    };

    const createNewProject = () => {
        const newProject: Project = {
            title: "New Project",
            description: "",
            image_url: "",
            year: new Date().getFullYear().toString(),
            competencies: [],
            tools: [],
            live_link: "",
            github_link: "",
            is_featured: false,
            position: projects.length
        };
        setSelectedProject(newProject);
    };

    const handleSave = async () => {
        if (!selectedProject || !selectedProject.title.trim()) {
            alert("Title is required");
            return;
        }

        setLoading(true);
        try {
            const { id, ...projectData } = selectedProject;

            if (id) {
                // Update existing
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', id);
                
                if (error) throw error;
                alert("✓ Project updated!");
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('projects')
                    .insert([projectData])
                    .select()
                    .single();
                
                if (error) throw error;
                if (data) setSelectedProject(data);
                alert("✓ Project created!");
            }
            
            fetchProjects();
        } catch (err: any) {
            alert("Error saving: " + err.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!selectedProject?.id) return;
        if (!confirm(`Delete "${selectedProject.title}"?`)) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', selectedProject.id);
            
            if (error) throw error;
            
            alert("✓ Project deleted!");
            setSelectedProject(null);
            fetchProjects();
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    // Tag input handlers for Competencies
    const handleCompetencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && competencyInput.trim() && selectedProject) {
            e.preventDefault();
            const newCompetency = competencyInput.trim();
            if (!selectedProject.competencies.includes(newCompetency)) {
                setSelectedProject({
                    ...selectedProject,
                    competencies: [...selectedProject.competencies, newCompetency]
                });
            }
            setCompetencyInput("");
        }
    };

    const removeCompetency = (index: number) => {
        if (!selectedProject) return;
        setSelectedProject({
            ...selectedProject,
            competencies: selectedProject.competencies.filter((_, i) => i !== index)
        });
    };

    // Tag input handlers for Tools (Tech Stack)
    const handleToolKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && toolInput.trim() && selectedProject) {
            e.preventDefault();
            const newTool = toolInput.trim().toLowerCase();
            if (!selectedProject.tools.includes(newTool)) {
                setSelectedProject({
                    ...selectedProject,
                    tools: [...selectedProject.tools, newTool]
                });
            }
            setToolInput("");
        }
    };

    const removeTool = (index: number) => {
        if (!selectedProject) return;
        setSelectedProject({
            ...selectedProject,
            tools: selectedProject.tools.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-200px)]">
            {/* LEFT: PROJECT LIST */}
            <div className="w-80 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-bold">Projects</h3>
                    <button
                        onClick={createNewProject}
                        className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                        title="New Project"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {projects.length === 0 && (
                        <div className="p-6 text-center text-slate-500 text-sm">
                            No projects yet. Click + to create one.
                        </div>
                    )}
                    
                    {projects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/10 transition-colors text-left ${
                                selectedProject?.id === project.id ? 'bg-white/10 border-l-4 border-l-purple-500' : ''
                            }`}
                        >
                            <div className="w-12 h-12 rounded bg-black overflow-hidden flex-shrink-0">
                                {project.image_url ? (
                                    <img 
                                        src={project.image_url} 
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 text-xs">
                                        IMG
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white font-medium truncate">
                                    {project.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {project.competencies?.length || 0} skills · {project.tools?.length || 0} tools
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: EDITOR */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                {selectedProject ? (
                    <>
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {selectedProject.id ? 'Edit Project' : 'New Project'}
                            </h3>
                            <div className="flex items-center gap-2">
                                {selectedProject.id && (
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* General Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedProject.title}
                                        onChange={(e) => setSelectedProject({
                                            ...selectedProject,
                                            title: e.target.value
                                        })}
                                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Project Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={selectedProject.description}
                                        onChange={(e) => setSelectedProject({
                                            ...selectedProject,
                                            description: e.target.value
                                        })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                                        placeholder="Brief description of the project..."
                                    />
                                </div>

                                {/* Image Upload Component */}
                                <ImageUpload
                                    currentUrl={selectedProject.image_url}
                                    onUploadComplete={(url) => setSelectedProject({
                                        ...selectedProject,
                                        image_url: url
                                    })}
                                    folder="projects"
                                    label="Project Thumbnail"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">
                                            Live Link
                                        </label>
                                        <input
                                            type="url"
                                            value={selectedProject.live_link}
                                            onChange={(e) => setSelectedProject({
                                                ...selectedProject,
                                                live_link: e.target.value
                                            })}
                                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">
                                            GitHub Link
                                        </label>
                                        <input
                                            type="url"
                                            value={selectedProject.github_link}
                                            onChange={(e) => setSelectedProject({
                                                ...selectedProject,
                                                github_link: e.target.value
                                            })}
                                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CORE COMPETENCIES (Text Pills) */}
                            <div className="border-t border-white/10 pt-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Core Competencies (Text Pills)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Type a skill and press Enter. E.g., "WebSockets", "REST APIs", "Real-time Systems"
                                </p>
                                
                                <input
                                    type="text"
                                    value={competencyInput}
                                    onChange={(e) => setCompetencyInput(e.target.value)}
                                    onKeyDown={handleCompetencyKeyDown}
                                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none mb-3"
                                    placeholder="Type skill and press Enter..."
                                />

                                {selectedProject.competencies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.competencies.map((comp, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-700 text-slate-300 rounded-full text-sm"
                                            >
                                                {comp}
                                                <button
                                                    onClick={() => removeCompetency(idx)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* TECH STACK (Icons) */}
                            <div className="border-t border-white/10 pt-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Tech Stack (SimpleIcon Slugs)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Type SimpleIcon slug and press Enter. E.g., "nextdotjs", "supabase", "python"
                                    <br />
                                    <a 
                                        href="https://simpleicons.org/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Browse icons at simpleicons.org →
                                    </a>
                                </p>
                                
                                <input
                                    type="text"
                                    value={toolInput}
                                    onChange={(e) => setToolInput(e.target.value)}
                                    onKeyDown={handleToolKeyDown}
                                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none mb-3"
                                    placeholder="Type icon slug and press Enter..."
                                />

                                {selectedProject.tools.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProject.tools.map((tool, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 rounded-lg hover:border-white/30 transition-colors"
                                            >
                                                <img
                                                    src={`https://cdn.simpleicons.org/${tool}`}
                                                    alt={tool}
                                                    className="w-6 h-6"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                                <span className="text-sm text-slate-300">{tool}</span>
                                                <button
                                                    onClick={() => removeTool(idx)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PREVIEW SECTION */}
                            <div className="border-t border-white/10 pt-6">
                                <h4 className="text-sm font-medium text-slate-400 mb-3">Preview</h4>
                                <div className="bg-black border border-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {selectedProject.title}
                                    </h3>
                                    
                                    {selectedProject.description && (
                                        <p className="text-slate-400 text-sm mb-4">
                                            {selectedProject.description}
                                        </p>
                                    )}

                                    {/* Core Competencies Pills */}
                                    {selectedProject.competencies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedProject.competencies.map((comp, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs"
                                                >
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tech Stack Icons */}
                                    {selectedProject.tools.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {selectedProject.tools.map((tool, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`https://cdn.simpleicons.org/${tool}`}
                                                    alt={tool}
                                                    className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                                                    title={tool}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(selectedProject.live_link || selectedProject.github_link) && (
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                            {selectedProject.live_link && (
                                                <a
                                                    href={selectedProject.live_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                                                >
                                                    <ExternalLink size={14} />
                                                    Live Demo
                                                </a>
                                            )}
                                            {selectedProject.github_link && (
                                                <a
                                                    href={selectedProject.github_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
                                                >
                                                    <Github size={14} />
                                                    Source Code
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <p className="mb-4">No project selected</p>
                            <button
                                onClick={createNewProject}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors mx-auto"
                            >
                                <Plus size={16} />
                                Create New Project
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
