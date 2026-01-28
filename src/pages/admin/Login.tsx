import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Lock, ArrowRight, KeyRound, Loader2, Fingerprint } from "lucide-react";

export default function AdminLogin() {
    // HARDCODED IDENTITY - No need to type it
    const EMAIL = "alisaad75878@gmail.com";

    const [code, setCode] = useState("");
    const [step, setStep] = useState<"init" | "verify">("init");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // STEP 1: TRIGGER THE EMAIL
    const handleRequestAccess = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email: EMAIL,
        });

        setLoading(false);

        if (error) {
            alert("System Error: " + error.message);
        } else {
            setStep("verify"); // Move to code entry
        }
    };

    // STEP 2: VERIFY THE CODE
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
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black border border-white/10 mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        {step === "init" ? <Fingerprint size={32} /> : <Lock size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {step === "init" ? "Identity Verified" : "Security Check"}
                    </h1>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        {step === "init" ? "Ali Saad Khan" : "Awaiting Protocol"}
                    </p>
                </div>

                {/* VIEW 1: REQUEST BUTTON */}
                {step === "init" && (
                    <div className="space-y-4">
                        <div className="p-4 bg-black/50 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-slate-400 font-mono">Target: {EMAIL}</span>
                        </div>
                        <button
                            onClick={handleRequestAccess}
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Initialize Sequence <ArrowRight size={18} /></>}
                        </button>
                    </div>
                )}

                {/* VIEW 2: CODE INPUT */}
                {step === "verify" && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <KeyRound size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                autoFocus
                                className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500 transition-all tracking-[0.5em] font-mono text-center text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Authorize Access"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("init")}
                            className="w-full text-xs text-slate-600 hover:text-white mt-4 font-mono"
                        >
                            [CANCEL SEQUENCE]
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
