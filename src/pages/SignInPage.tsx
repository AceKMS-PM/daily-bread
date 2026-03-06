import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import CrossIcon from "@/components/ui/CrossIcon";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const ensureUser = useMutation(api.users.ensureUser);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signIn("password", { email, password, name, flow: "signUp" });
      } else {
        await signIn("password", { email, password, flow: "signIn" });
      }
      // Create/update our user profile
      await ensureUser();
      navigate("/");
    } catch (e: any) {
      setError(e.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)" }}
      />
      <div className="w-full max-w-md relative fade-up">
        <div
          className="p-10 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #1A1308 0%, #2A1F0E 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(201,168,76,0.5))" }}>
              <CrossIcon size={36} color="#C9A84C" />
            </div>
            <h1 className="font-display text-3xl text-gradient-gold">Daily Bread</h1>
            <p className="font-sans text-xs tracking-widest uppercase mt-1" style={{ color: "rgba(201,168,76,0.4)" }}>
              Pain Quotidien
            </p>
          </div>

          <h2 className="font-display text-xl text-parchment-100 mb-6 text-center">
            {isSignUp ? "Rejoindre la communauté" : "Se connecter"}
          </h2>

          <div className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="field-label">Nom complet</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className="field-input" />
              </div>
            )}
            <div>
              <label className="field-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.com" className="field-input" />
            </div>
            <div>
              <label className="field-label">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="field-input" />
            </div>

            {error && <p className="font-sans text-sm text-red-400 text-center">{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="btn-gold w-full mt-2" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : isSignUp ? "Créer mon compte" : "Se connecter"}
            </button>
          </div>

          <p className="font-sans text-sm text-center mt-6" style={{ color: "rgba(249,241,224,0.4)" }}>
            {isSignUp ? "Déjà membre ?" : "Pas encore de compte ?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ color: "rgba(201,168,76,0.8)" }}>
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
            <p className="font-serif italic text-sm" style={{ color: "rgba(249,241,224,0.3)", lineHeight: 1.7 }}>
              « Heureux ceux qui ont faim et soif de la justice »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}