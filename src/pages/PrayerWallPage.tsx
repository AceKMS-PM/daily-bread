import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";

export default function PrayerWallPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const prayers = useQuery(api.prayers.getPublicPrayerRequests, { limit: 50 });
  const createPrayer = useMutation(api.prayers.createPrayerRequest);
  const deletePrayer = useMutation(api.prayers.deleteMyPrayer);
  const { isAuthenticated } = useConvexAuth();

  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await createPrayer({ content, isPublic, isAnonymous });
      setContent("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14 fade-up">
        <CrossIcon size={32} color="rgba(201,168,76,0.4)" className="mx-auto mb-6" />
        <h1
          className="font-display mb-4"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#f9f1e0", fontWeight: 300 }}
        >
          Mur de Prière
        </h1>
        <p className="font-serif text-lg" style={{ color: "rgba(249,241,224,0.45)" }}>
          « Portez les fardeaux les uns des autres » — Galates 6:2
        </p>
      </div>

      {/* Submit form */}
      {isAuthenticated ? (
        <div
          className="p-8 rounded-2xl mb-12 fade-up animate-delay-100"
          style={{
            background: "linear-gradient(135deg, rgba(26,19,8,0.9) 0%, rgba(42,31,14,0.9) 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <h3 className="font-display text-xl text-parchment-100 mb-4">Partager une prière</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écris ta demande de prière ici..."
            rows={4}
            className="field-input resize-none mb-4"
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-10 h-6 rounded-full relative transition-colors duration-200"
                  style={{ background: isPublic ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)" }}
                  onClick={() => setIsPublic(!isPublic)}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                    style={{
                      background: isPublic ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      transform: isPublic ? "translateX(18px)" : "translateX(4px)",
                    }}
                  />
                </div>
                <span className="font-sans text-sm" style={{ color: "rgba(249,241,224,0.5)" }}>
                  {isPublic ? "Public" : "Privé (admin seulement)"}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-10 h-6 rounded-full relative transition-colors duration-200"
                  style={{ background: isAnonymous ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)" }}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                    style={{
                      background: isAnonymous ? "#C9A84C" : "rgba(255,255,255,0.5)",
                      transform: isAnonymous ? "translateX(18px)" : "translateX(4px)",
                    }}
                  />
                </div>
                <span className="font-sans text-sm" style={{ color: "rgba(249,241,224,0.5)" }}>
                  Rester anonyme
                </span>
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="btn-gold"
              style={{ opacity: submitting || !content.trim() ? 0.5 : 1 }}
            >
              {submitted ? "✓ Envoyé" : submitting ? "..." : "Soumettre"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-6 rounded-2xl mb-12 text-center"
          style={{ border: "1px dashed rgba(201,168,76,0.2)" }}
        >
          <p className="font-serif" style={{ color: "rgba(249,241,224,0.4)" }}>
            Connecte-toi pour partager une demande de prière.
          </p>
        </div>
      )}

      {/* Prayer cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {prayers === undefined
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="sacred-card rounded-xl p-6 h-40 animate-pulse" />
            ))
          : prayers.map((p) => (
              <div
                key={p._id}
                className="p-6 rounded-xl transition-all duration-200 relative group"
                style={{
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                {currentUser?._id === p.userId && (
                  <button
                    onClick={async () => { if (confirm("Supprimer cette demande de prière ?")) await deletePrayer({ id: p._id }); }}
                    className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "rgba(196,68,68,0.6)" }}
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-sacred-dark flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}
                  >
                    {p.user?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-sans text-sm text-parchment-100">{p.user?.name ?? "Anonyme"}</p>
                    <p className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.3)" }}>
                      {format(new Date(p.createdAt), "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                </div>

                <p className="font-serif mb-4" style={{ color: "rgba(249,241,224,0.65)", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  {p.content}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
