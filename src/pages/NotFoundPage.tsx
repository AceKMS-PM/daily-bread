import { Link } from "react-router-dom";
import CrossIcon from "@/components/ui/CrossIcon";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div style={{ animation: "float 3s ease-in-out infinite" }}>
        <CrossIcon size={48} color="rgba(201,168,76,0.2)" className="mx-auto mb-8" />
      </div>
      <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(201,168,76,0.4)" }}>
        404
      </p>
      <h1 className="font-display text-4xl text-parchment-100 mb-4" style={{ fontWeight: 300 }}>
        Page introuvable
      </h1>
      <p className="font-serif mb-10" style={{ color: "rgba(249,241,224,0.35)", lineHeight: 1.8 }}>
        « Je suis le chemin, la vérité et la vie » — Jean 14:6
      </p>
      <Link to="/" className="btn-gold">
        Retour à l'accueil
      </Link>
    </div>
  );
}