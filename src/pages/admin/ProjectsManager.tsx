import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id?: number;
  title: string;
  description: string | null;
  image_url: string | null;
  year: string | null;
  competencies: string[];
  tools: string[];
  live_link: string | null;
  github_link: string | null;
  is_featured: boolean;
  position: number | null;
}

const emptyProject: Project = {
  title: "",
  description: "",
  image_url: "",
  year: new Date().getFullYear().toString(),
  competencies: [],
  tools: [],
  live_link: "",
  github_link: "",
  is_featured: false,
  position: 0,
};

export default function ProjectsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [competencyInput, setCompetencyInput] = useState("");
  const [toolInput, setToolInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `project-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      setEditingProject({ ...editingProject, image_url: publicUrl });
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addCompetency = () => {
    if (!competencyInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      competencies: [...editingProject.competencies, competencyInput.trim()],
    });
    setCompetencyInput("");
  };

  const removeCompetency = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      competencies: editingProject.competencies.filter((_, i) => i !== index),
    });
  };

  const addTool = () => {
    if (!toolInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      tools: [...editingProject.tools, toolInput.trim().toLowerCase()],
    });
    setToolInput("");
  };

  const removeTool = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tools: editingProject.tools.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!editingProject) return;

    setSaving(true);
    const projectData = {
      ...editingProject,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingProject.id) {
      // Update existing project
      ({ error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id));
    } else {
      // Insert new project
      ({ error } = await supabase
        .from("projects")
        .insert([projectData]));
    }

    if (error) {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project saved successfully",
      });
      setDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project deleted successfully",
      });
      fetchProjects();
    }
  };

  const openEditDialog = (project: Project | null) => {
    setEditingProject(project || { ...emptyProject });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Button
          onClick={() => openEditDialog(null)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2" size={16} />
          Add Project
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">Image</TableHead>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Year</TableHead>
                <TableHead className="text-gray-300">Tools</TableHead>
                <TableHead className="text-gray-300">Featured</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No projects yet. Click "Add Project" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell className="text-gray-400">{project.year}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {project.tools.slice(0, 3).map((tool, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {project.tools.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.is_featured && (
                        <Badge className="bg-purple-600">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => openEditDialog(project)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => project.id && handleDelete(project.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-6 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  placeholder="Project Title"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  placeholder="Project description..."
                  rows={4}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={editingProject.year || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, year: e.target.value })
                  }
                  placeholder="2024"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Project Image</Label>
                {editingProject.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={editingProject.image_url}
                      alt="Project"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-700"
                    />
                    <Button
                      onClick={() =>
                        setEditingProject({ ...editingProject, image_url: "" })
                      }
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <Upload className="mx-auto mb-4 text-gray-500" size={48} />
                    <label htmlFor="project-image-upload" className="cursor-pointer">
                      <span className="text-purple-500 hover:text-purple-400">
                        Click to upload
                      </span>
                      <span className="text-gray-400"> or drag and drop</span>
                    </label>
                    <input
                      id="project-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                )}
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="animate-spin" size={16} />
                    Uploading...
                  </div>
                )}
              </div>

              {/* Tech Stack (Tools) */}
              <div className="space-y-2">
                <Label>Tech Stack (Icon Slugs)</Label>
                <p className="text-sm text-gray-400">
                  Enter slugs like: react, nextdotjs, python, django, etc.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTool())}
                    placeholder="e.g., react"
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button onClick={addTool} type="button">
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {editingProject.tools.map((tool, i) => (
                    <Badge key={i} variant="secondary" className="gap-2">
                      {tool}
                      <X
                        size={14}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeTool(i)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Competencies */}
              <div className="space-y-2">
                <Label>Competencies</Label>
                <p className="text-sm text-gray-400">
                  Enter skills like: System Design, API Development, etc.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={competencyInput}
                    onChange={(e) => setCompetencyInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCompetency())
                    }
                    placeholder="e.g., System Design"
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button onClick={addCompetency} type="button">
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {editingProject.competencies.map((comp, i) => (
                    <Badge key={i} variant="outline" className="gap-2">
                      {comp}
                      <X
                        size={14}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeCompetency(i)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live_link">Live Link</Label>
                  <Input
                    id="live_link"
                    value={editingProject.live_link || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_link: e.target.value })
                    }
                    placeholder="https://..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_link">GitHub Link</Label>
                  <Input
                    id="github_link"
                    value={editingProject.github_link || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_link: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={editingProject.is_featured}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, is_featured: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Mark as Featured Project
                </Label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={() => setDialogOpen(false)}
                  variant="outline"
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !editingProject.title}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Saving...
                    </>
                  ) : (
                    "Save Project"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
