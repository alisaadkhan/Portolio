import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Terminal } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Auth Failed: " + error.message);
        } else {
            navigate("/admin/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-purple-500/30">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 text-purple-400">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Access</h1>
                    <p className="text-slate-500">Restricted area. Authorized personnel only.</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                            <Terminal size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="Access Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : <>Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-xs font-mono text-slate-600 hover:text-white transition-colors">
                        ← Return to Public Terminal
                    </a>
                </div>
            </div>
        </div>
    );
}
