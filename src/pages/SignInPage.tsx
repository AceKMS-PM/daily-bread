import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import CrossIcon from "@/components/ui/CrossIcon";
import { Eye, EyeOff, Check, X } from "lucide-react";

function validatePassword(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-sans">
      {ok ? <Check size={12} style={{ color: "#A4B478" }} /> : <X size={12} style={{ color: "rgba(249,241,224,0.3)" }} />}
      <span style={{ color: ok ? "#A4B478" : "rgba(249,241,224,0.35)" }}>{label}</span>
    </div>
  );
}

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const ensureUser = useMutation(api.users.ensureUser);
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Dès que la session est établie, créer le profil et rediriger
  useEffect(() => {
    if (isAuthenticated) {
      ensureUser()
        .catch(() => {})
        .finally(() => navigate("/"));
    }
  }, [isAuthenticated]);

  const rules = validatePassword(password);
  const passwordValid = rules.length && rules.uppercase && rules.number;
  const formValid = isSignUp
    ? email.trim() && name.trim() && passwordValid
    : email.trim() && password.length >= 1;

  const handleSubmit = async () => {
    if (!formValid) return;
    if (!email.includes("@")) { setError("Adresse email invalide."); return; }

    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signIn("password", { email, password, name, flow: "signUp" });
      } else {
        await signIn("password", { email, password, flow: "signIn" });
      }
      // La redirection se fait via le useEffect ci-dessus
    } catch (e: any) {
      const msg = e.message ?? "";
      if (msg.includes("Invalid password") || msg.includes("password")) {
        setError("Mot de passe incorrect ou ne respecte pas les conditions.");
      } else if (msg.includes("already exists") || msg.includes("duplicate")) {
        setError("Un compte existe déjà avec cet email.");
      } else if (msg.includes("not found") || msg.includes("No account")) {
        setError("Aucun compte trouvé avec cet email.");
      } else if (msg.includes("email")) {
        setError("Adresse email invalide.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
      <div className="w-full max-w-md relative fade-up">
        <div className="p-10 rounded-2xl" style={{ background: "linear-gradient(135deg, #1A1308 0%, #2A1F0E 100%)", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(201,168,76,0.5))" }}>
              <CrossIcon size={36} color="#C9A84C" />
            </div>
            <h1 className="font-display text-3xl text-gradient-gold">Daily Bread</h1>
            <p className="font-sans text-xs tracking-widest uppercase mt-1" style={{ color: "rgba(201,168,76,0.4)" }}>Pain Quotidien</p>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="field-input pr-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(249,241,224,0.3)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (passwordFocused || password.length > 0) && (
                <div className="mt-3 p-3 rounded-lg flex flex-col gap-1.5" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(201,168,76,0.1)" }}>
                  <PasswordRule ok={rules.length} label="Minimum 8 caractères" />
                  <PasswordRule ok={rules.uppercase} label="Au moins une majuscule" />
                  <PasswordRule ok={rules.number} label="Au moins un chiffre" />
                </div>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg font-sans text-sm text-center" style={{ background: "rgba(139,32,32,0.2)", border: "1px solid rgba(139,32,32,0.4)", color: "#f87171" }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || !formValid} className="btn-gold w-full mt-2" style={{ opacity: loading || !formValid ? 0.5 : 1, cursor: !formValid ? "not-allowed" : "pointer" }}>
              {loading ? "Connexion en cours..." : isSignUp ? "Créer mon compte" : "Se connecter"}
            </button>
          </div>

          <p className="font-sans text-sm text-center mt-6" style={{ color: "rgba(249,241,224,0.4)" }}>
            {isSignUp ? "Déjà membre ?" : "Pas encore de compte ?"}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setPassword(""); }} style={{ color: "rgba(201,168,76,0.8)" }}>
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