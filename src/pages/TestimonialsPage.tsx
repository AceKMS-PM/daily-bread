import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";

export default function TestimonialsPage() {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);
  const testimonials = useQuery(api.testimonials.getApprovedTestimonials, { limit: 30 });
  const createTestimonial = useMutation(api.testimonials.createTestimonial);
  const deleteTestimonial = useMutation(api.testimonials.deleteMyTestimonial);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await createTestimonial({ content, isAnonymous });
      setContent("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e: any) {
      setError(e.message ?? "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 fade-up">
        <CrossIcon size={32} color="rgba(var(--gold-rgb),0.4)" className="mx-auto mb-6" />
        <h1
          className="font-display mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--parchment-100)", fontWeight: 300 }}
        >
          Témoignages
        </h1>
        <p className="font-serif text-lg" style={{ color: "rgba(var(--text-rgb),0.60)" }}>
          Ce que Dieu fait dans nos vies
        </p>
      </div>

      {/* Submit Form */}
      {isAuthenticated ? (
        <div
          className="max-w-2xl mx-auto mb-16 p-6 rounded-xl"
          style={{
            background: "rgba(var(--surface-rgb),0.6)",
            border: "1px solid rgba(var(--gold-rgb),0.12)",
          }}
        >
          <h2 className="font-display text-xl text-parchment-100 mb-4">
            Partage ton témoignage
          </h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Raconte ce que Dieu a fait dans ta vie..."
            rows={4}
            className="w-full bg-transparent border rounded-lg p-4 font-serif text-sm resize-none outline-none transition-colors"
            style={{
              borderColor: "rgba(var(--gold-rgb),0.2)",
              color: "rgba(var(--text-rgb),0.90)",
              lineHeight: 1.8,
            }}
            maxLength={1000}
          />
          {error && (
            <p className="font-sans text-xs mt-2" style={{ color: "var(--crimson-light)" }}>
              {error}
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-10 h-6 rounded-full relative transition-colors duration-200"
                style={{ background: isAnonymous ? "rgba(var(--gold-rgb),0.4)" : "rgba(var(--white-rgb),0.1)" }}
                onClick={() => setIsAnonymous(!isAnonymous)}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                  style={{
                    background: isAnonymous ? "var(--gold)" : "rgba(var(--white-rgb),0.5)",
                    transform: isAnonymous ? "translateX(18px)" : "translateX(4px)",
                  }}
                />
              </div>
              <span className="font-sans text-sm" style={{ color: "rgba(var(--text-rgb),0.65)" }}>
                Rester anonyme
              </span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="btn-gold font-sans text-xs"
              style={{ padding: "0.5rem 1.5rem", opacity: submitting || !content.trim() ? 0.5 : 1 }}
            >
              {submitting ? "..." : submitted ? "✓ Envoyé" : "Envoyer"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="max-w-2xl mx-auto mb-16 p-6 rounded-xl text-center"
          style={{
            border: "1px dashed rgba(var(--gold-rgb),0.2)",
          }}
        >
          <p className="font-serif" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
            Connecte-toi pour partager ton témoignage.
          </p>
        </div>
      )}

      {/* Testimonials Grid */}
      {testimonials === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 h-40 animate-pulse" style={{ background: "rgba(var(--surface-rgb),0.6)" }} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl" style={{ color: "rgba(var(--text-rgb),0.40)" }}>
            Aucun témoignage pour l'instant
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t._id}
              className="fade-up rounded-xl p-6 transition-all relative group"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: "rgba(var(--gold-rgb),0.04)",
                border: "1px solid rgba(var(--gold-rgb),0.1)",
              }}
            >
              {currentUser?._id === t.userId && (
                <button
                  onClick={async () => { if (confirm("Supprimer ce témoignage ?")) await deleteTestimonial({ id: t._id }); }}
                  className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(var(--crimson-light-rgb),0.6)" }}
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-text-on-gold flex-shrink-0"
                    style={{ background: "var(--gradient-gold)" }}
                >
                  {t.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="font-sans text-sm text-parchment-100">
                    {t.user?.name ?? "Anonyme"}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "rgba(var(--text-rgb),0.45)" }}>
                    {format(new Date(t.createdAt), "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <p
                className="font-serif text-sm leading-relaxed"
                style={{ color: "rgba(var(--text-rgb),0.80)", lineHeight: 1.8 }}
              >
                {t.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
