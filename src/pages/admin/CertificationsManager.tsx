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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Edit, Trash2, Plus, ExternalLink } from "lucide-react";

interface Certification {
  id?: number;
  title: string | null;
  image_url: string;
  issuer: string | null;
  issue_date: string | null;
  credential_url: string | null;
}

const emptyCertification: Certification = {
  title: "",
  image_url: "",
  issuer: "",
  issue_date: "",
  credential_url: "",
};

export default function CertificationsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching certifications",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCertifications(data || []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

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
    const fileName = `certification-${Date.now()}.${fileExt}`;

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

      setEditingCert({ ...editingCert, image_url: publicUrl });
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

  const handleSave = async () => {
    if (!editingCert || !editingCert.image_url) {
      toast({
        title: "Missing required fields",
        description: "Image is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const certData = {
      ...editingCert,
      created_at: new Date().toISOString(),
    };

    let error;
    if (editingCert.id) {
      // Update existing certification
      ({ error } = await supabase
        .from("certifications")
        .update(certData)
        .eq("id", editingCert.id));
    } else {
      // Insert new certification
      ({ error } = await supabase.from("certifications").insert([certData]));
    }

    if (error) {
      toast({
        title: "Error saving certification",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Certification saved successfully",
      });
      setDialogOpen(false);
      setEditingCert(null);
      fetchCertifications();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting certification",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Certification deleted successfully",
      });
      fetchCertifications();
    }
  };

  const openEditDialog = (cert: Certification | null) => {
    setEditingCert(cert || { ...emptyCertification });
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
          <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
          <p className="text-gray-400">Manage your professional certifications</p>
        </div>
        <Button
          onClick={() => openEditDialog(null)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2" size={16} />
          Add Certification
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">Badge</TableHead>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Issuer</TableHead>
                <TableHead className="text-gray-300">Issue Date</TableHead>
                <TableHead className="text-gray-300">Credential</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No certifications yet. Click "Add Certification" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                certifications.map((cert) => (
                  <TableRow key={cert.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      <img
                        src={cert.image_url}
                        alt={cert.title || "Certification"}
                        className="w-16 h-16 object-contain rounded"
                      />
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {cert.title || "Untitled"}
                    </TableCell>
                    <TableCell className="text-gray-400">{cert.issuer || "—"}</TableCell>
                    <TableCell className="text-gray-400">
                      {cert.issue_date
                        ? new Date(cert.issue_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          View
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => openEditDialog(cert)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => cert.id && handleDelete(cert.id)}
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
              {editingCert?.id ? "Edit Certification" : "Add New Certification"}
            </DialogTitle>
          </DialogHeader>

          {editingCert && (
            <div className="space-y-6 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingCert.title || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, title: e.target.value })
                  }
                  placeholder="AWS Certified Solutions Architect"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer</Label>
                <Input
                  id="issuer"
                  value={editingCert.issuer || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, issuer: e.target.value })
                  }
                  placeholder="Amazon Web Services"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={editingCert.issue_date || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, issue_date: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Credential URL */}
              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  value={editingCert.credential_url || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, credential_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Badge Image *</Label>
                {editingCert.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={editingCert.image_url}
                      alt="Certification Badge"
                      className="w-full max-w-sm h-48 object-contain rounded-lg border border-gray-700 bg-white p-4"
                    />
                    <Button
                      onClick={() =>
                        setEditingCert({ ...editingCert, image_url: "" })
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
                    <label htmlFor="cert-image-upload" className="cursor-pointer">
                      <span className="text-purple-500 hover:text-purple-400">
                        Click to upload
                      </span>
                      <span className="text-gray-400"> or drag and drop</span>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                    <input
                      id="cert-image-upload"
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
                  disabled={saving || !editingCert.image_url}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Saving...
                    </>
                  ) : (
                    "Save Certification"
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
