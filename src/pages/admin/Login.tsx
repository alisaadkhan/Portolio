import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Lock, KeyRound, Loader2, Fingerprint, RefreshCw } from "lucide-react";

export default function AdminLogin() {
    const EMAIL = "alisaad75878@gmail.com";

    const [code, setCode] = useState("");
    const [status, setStatus] = useState<"sending" | "ready">("sending");
    const [loading, setLoading] = useState(false);
    const sentRef = useRef(false); // Prevents double-sending on load
    const navigate = useNavigate();

    // AUTOMATIC TRIGGER ON LOAD
    useEffect(() => {
        if (!sentRef.current) {
            sentRef.current = true;
            sendCode();
        }
    }, []);

    const sendCode = async () => {
        setStatus("sending");
        const { error } = await supabase.auth.signInWithOtp({
            email: EMAIL,
        });

        if (error) {
            alert("Auto-Send Failed: " + error.message);
        }
        setStatus("ready");
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.verifyOtp({
            email: EMAIL,
            token: code,
            type: "email",
        });

        setLoading(false);

        if (error) {
            alert("Access Denied: Invalid Code");
        } else {
            navigate("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-purple-500/30">
            <div className="w-full max-w-sm bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black border border-white/10 mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        {status === "sending" ? <Loader2 className="animate-spin" size={32} /> : <Lock size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {status === "sending" ? "Authenticating..." : "Security Check"}
                    </h1>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        {status === "sending" ? "Sending Protocol to Inbox" : "Awaiting Authorization"}
                    </p>
                </div>

                {/* CODE INPUT FORM */}
                <form onSubmit={handleVerifyCode} className={`space-y-4 transition-opacity duration-500 ${status === "sending" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <KeyRound size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            disabled={status === "sending"}
                            className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-purple-500 transition-all tracking-[0.5em] font-mono text-center text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || status === "sending"}
                        className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Authorize Access"}
                    </button>

                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={sendCode}
                            className="text-xs text-slate-600 hover:text-white flex items-center gap-2 font-mono transition-colors"
                        >
                            <RefreshCw size={12} /> RESEND SIGNAL
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
