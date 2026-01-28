import { useState, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    currentUrl: string;
    onUploadComplete: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUpload({ 
    currentUrl, 
    onUploadComplete, 
    folder = "projects",
    label = "Upload Image"
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImage = async (file: File) => {
        try {
            setUploading(true);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file (PNG, JPG, WEBP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(data.path);

            setPreviewUrl(publicUrl);
            onUploadComplete(publicUrl);

        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadImage(e.dataTransfer.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadImage(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setPreviewUrl("");
        onUploadComplete("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">
                {label}
            </label>

            {/* Upload Area */}
            {!previewUrl ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                        dragActive 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-white/10 bg-black hover:border-white/30 hover:bg-white/5'
                    }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                            <p className="text-sm text-slate-400">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-full">
                                <Upload className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium mb-1">
                                    Drop image here or click to browse
                                </p>
                                <p className="text-xs text-slate-500">
                                    PNG, JPG, WEBP up to 5MB
                                </p>
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                </div>
            ) : (
                <div className="relative group">
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-black">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                            title="Change Image"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Remove Image"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                </div>
            )}

            {/* Manual URL Input (Fallback) */}
            <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-2">Or paste image URL:</p>
                <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => {
                        setPreviewUrl(e.target.value);
                        onUploadComplete(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 text-sm bg-black border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
            </div>
        </div>
    );
}
