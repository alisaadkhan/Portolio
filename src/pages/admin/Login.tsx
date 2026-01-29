import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("alisaad75878@gmail.com");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // LOGIN WITH PASSWORD INSTROADS OF OTP
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);

        if (error) {
            alert("Login Failed: " + error.message);
        } else {
            // Success! Navigate to admin root
            navigate("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-purple-500/30">
            <div className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black border border-white/10 mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Password Authentication</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={18} /></>}
                    </button>
                </form>

            </div>
        </div>
    );
}
