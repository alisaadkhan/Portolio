import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";

interface Skill {
  id?: number;
  name: string;
  type: "core" | "tech_stack";
  icon_name: string | null;
  position: number | null;
}

const emptySkill: Skill = {
  name: "",
  type: "tech_stack",
  icon_name: "",
  position: 0,
};

export default function SkillsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSkills(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingSkill) return;

    setSaving(true);
    const skillData = {
      ...editingSkill,
      created_at: new Date().toISOString(),
    };

    let error;
    if (editingSkill.id) {
      // Update existing skill
      ({ error } = await supabase
        .from("skills")
        .update(skillData)
        .eq("id", editingSkill.id));
    } else {
      // Insert new skill
      ({ error } = await supabase.from("skills").insert([skillData]));
    }

    if (error) {
      toast({
        title: "Error saving skill",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Skill saved successfully",
        description: "Frontend will automatically render the icon from simple-icons",
      });
      setDialogOpen(false);
      setEditingSkill(null);
      fetchSkills();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Skill deleted successfully",
      });
      fetchSkills();
    }
  };

  const openEditDialog = (skill: Skill | null) => {
    setEditingSkill(skill || { ...emptySkill });
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
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-gray-400">Manage your tech stack and core competencies</p>
        </div>
        <Button
          onClick={() => openEditDialog(null)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2" size={16} />
          Add Skill
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">Icon Preview</TableHead>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Slug</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No skills yet. Click "Add Skill" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                skills.map((skill) => (
                  <TableRow key={skill.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      {skill.icon_name ? (
                        <img
                          src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                          alt={skill.name}
                          className="w-8 h-8"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/32?text=?";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                          ?
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-medium">{skill.name}</TableCell>
                    <TableCell className="text-gray-400 font-mono text-sm">
                      {skill.icon_name || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          skill.type === "core"
                            ? "bg-purple-900/30 text-purple-300"
                            : "bg-blue-900/30 text-blue-300"
                        }`}
                      >
                        {skill.type === "core" ? "Core" : "Tech Stack"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => openEditDialog(skill)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => skill.id && handleDelete(skill.id)}
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
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSkill?.id ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>

          {editingSkill && (
            <div className="space-y-6 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  placeholder="e.g., React, Python, Next.js"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Icon Slug */}
              <div className="space-y-2">
                <Label htmlFor="icon_name">Simple Icons Slug *</Label>
                <Input
                  id="icon_name"
                  value={editingSkill.icon_name || ""}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, icon_name: e.target.value })
                  }
                  placeholder="e.g., react, python, nextdotjs"
                  className="bg-gray-800 border-gray-700"
                />
                <p className="text-sm text-gray-400">
                  Find slugs at{" "}
                  <a
                    href="https://simpleicons.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    simpleicons.org
                  </a>
                </p>
                {editingSkill.icon_name && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                    <span className="text-sm text-gray-400">Preview:</span>
                    <img
                      src={`https://cdn.simpleicons.org/${editingSkill.icon_name}`}
                      alt="Preview"
                      className="w-8 h-8"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/32?text=Invalid";
                      }}
                    />
                    <span className="text-white">{editingSkill.name}</span>
                  </div>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={editingSkill.type}
                  onValueChange={(value: "core" | "tech_stack") =>
                    setEditingSkill({ ...editingSkill, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="tech_stack">Tech Stack</SelectItem>
                    <SelectItem value="core">Core Competency</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">
                  Tech Stack: Technologies and frameworks. Core: Soft skills and competencies.
                </p>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Display Position (Optional)</Label>
                <Input
                  id="position"
                  type="number"
                  value={editingSkill.position || 0}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      position: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="bg-gray-800 border-gray-700"
                />
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
                  disabled={saving || !editingSkill.name || !editingSkill.icon_name}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Saving...
                    </>
                  ) : (
                    "Save Skill"
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
