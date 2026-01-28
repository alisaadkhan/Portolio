import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { toast } from "@/components/ui/sonner";
import { Trash2, Plus, Upload, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function CertificationsManager() {
    const [certs, setCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newCert, setNewCert] = useState({
        title: "",
        image_url: "",
        issuer: "",
        issue_date: ""
    });

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const { data, error } = await supabase
                .from('certifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCerts(data);
        } catch (err) {
            console.error("Error fetching certifications:", err);
        }
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newCert.image_url) {
            toast.error("Image Required", { description: "Please upload a certificate image" });
            return;
        }
        if (!newCert.title || !newCert.issuer) {
            toast.error("Missing Fields", { description: "Title and issuer are required" });
            return;
        }
        
        setUploading(true);
        try {
            // CORRECTED: Do NOT send credential_url field
            const certData = {
                title: newCert.title,
                image_url: newCert.image_url,
                issuer: newCert.issuer,
                issue_date: newCert.issue_date || null
            };

            const { data, error } = await supabase
                .from('certifications')
                .insert(certData)
                .select()
                .single();

            if (error) throw error;
            
            console.log("Admin Update Success:", data);
            
            setCerts([data, ...certs]);
            toast.success("Certificate Added", { description: `${newCert.title} has been uploaded` });
            setIsAdding(false);
            setNewCert({ title: "", image_url: "", issuer: "", issue_date: "" });
        } catch (err: any) {
            console.error("Certificate Add Error:", err);
            toast.error("Error", { description: err.message });
        }
        setUploading(false);
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Delete ${title || 'this certification'}? This cannot be undone.`)) return;
        
        try {
            const { error } = await supabase
                .from('certifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            console.log("Admin Delete Success: Certification ID", id);
            
            setCerts(certs.filter(c => c.id !== id));
            toast.success("Certificate Deleted", { description: `${title} has been removed` });
        } catch (err: any) {
            console.error("Certificate Delete Error:", err);
            toast.error("Error", { description: err.message });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Certifications</h3>
                    <p className="text-sm text-slate-500 mt-1">Showcase your professional credentials</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={16} /> Upload Certificate
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Certificate Title *</label>
                            <input
                                type="text"
                                placeholder="e.g., AWS Solutions Architect"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={newCert.title}
                                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Issuer *</label>
                            <input
                                type="text"
                                placeholder="e.g., Amazon Web Services"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                value={newCert.issuer}
                                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Image Upload Component */}
                    <ImageUpload
                        currentUrl={newCert.image_url}
                        onUploadComplete={(url) => setNewCert({ ...newCert, image_url: url })}
                        folder="certifications"
                        label="Certificate Image *"
                    />

                    <div>
                        <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Issue Date (Optional)</label>
                        <input
                            type="date"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                            value={newCert.issue_date}
                            onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleAdd}
                            disabled={uploading || !newCert.image_url}
                            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                            {uploading ? "Uploading..." : "Add Certificate"}
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-3 border border-white/10 text-slate-400 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Certifications Grid */}
            {certs.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                    <Upload className="mx-auto mb-4 text-slate-600" size={48} />
                    <h3 className="text-lg font-bold text-white mb-2">No Certifications Yet</h3>
                    <p className="text-slate-500">Upload your first certificate to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certs.map((cert) => (
                        <div key={`cert-${cert.id}`} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
                            {/* Certificate Image */}
                            <div className="aspect-video relative bg-black">
                                <img 
                                    src={cert.image_url} 
                                    alt={cert.title || "Certificate"} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(cert.id, cert.title)}
                                    className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Certificate Info */}
                            {(cert.title || cert.issuer) && (
                                <div className="p-4 space-y-2">
                                    {cert.title && (
                                        <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                                    )}
                                    {cert.issuer && (
                                        <p className="text-xs text-slate-400">{cert.issuer}</p>
                                    )}
                                    {cert.issue_date && (
                                        <p className="text-xs text-slate-500">
                                            {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
