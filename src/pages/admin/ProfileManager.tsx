import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface Profile {
  id: number;
  display_name: string | null;
  headline: string | null;
  about_text: string | null;
  avatar_url: string | null;
}

export default function ProfileManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    display_name: "",
    headline: "",
    about_text: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .single();

    if (error) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
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
    const fileName = `avatar-${Date.now()}.${fileExt}`;

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(fileName);

      setProfile({ ...profile, avatar_url: publicUrl });
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

  const removeImage = () => {
    setProfile({ ...profile, avatar_url: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from("profile")
      .upsert({
        id: profile.id || 1,
        display_name: profile.display_name,
        headline: profile.headline,
        about_text: profile.about_text,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile saved successfully",
        description: "Changes are now live on the main site",
      });
      fetchProfile();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your profile and hero section</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-gray-300">
              Display Name
            </Label>
            <Input
              id="display_name"
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              placeholder="Your Name"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline" className="text-gray-300">
              Headline
            </Label>
            <Input
              id="headline"
              value={profile.headline || ""}
              onChange={(e) =>
                setProfile({ ...profile, headline: e.target.value })
              }
              placeholder="Full Stack Developer | System Architect"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* About Text */}
          <div className="space-y-2">
            <Label htmlFor="about_text" className="text-gray-300">
              Bio / About Text
            </Label>
            <Textarea
              id="about_text"
              value={profile.about_text || ""}
              onChange={(e) =>
                setProfile({ ...profile, about_text: e.target.value })
              }
              placeholder="Tell us about yourself..."
              rows={6}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Avatar Image */}
          <div className="space-y-2">
            <Label className="text-gray-300">Avatar Image</Label>
            
            {profile.avatar_url ? (
              <div className="relative inline-block">
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                />
                <Button
                  onClick={removeImage}
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
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <span className="text-purple-500 hover:text-purple-400">
                    Click to upload
                  </span>
                  <span className="text-gray-400"> or drag and drop</span>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG up to 5MB
                  </p>
                </label>
                <input
                  id="avatar-upload"
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

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
