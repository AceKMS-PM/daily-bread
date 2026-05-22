import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X } from "lucide-react";

export default function AdminTestimonials() {
  const testimonials = useQuery(api.testimonials.getAllTestimonials);
  const approveTestimonial = useMutation(api.testimonials.approveTestimonial);
  const rejectTestimonial = useMutation(api.testimonials.rejectTestimonial);

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment-100 mb-8">Témoignages</h1>

      {testimonials === undefined ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 h-24 animate-pulse" style={{ background: "rgba(var(--surface-rgb),0.6)" }} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-display text-xl" style={{ color: "rgba(var(--text-rgb),0.40)" }}>
            Aucun témoignage
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-xl flex items-start gap-4"
              style={{
                background: t.isApproved ? "rgba(var(--surface-rgb),0.4)" : "rgba(var(--crimson-rgb),0.08)",
                border: `1px solid ${t.isApproved ? "rgba(var(--gold-rgb),0.1)" : "rgba(var(--crimson-rgb),0.2)"}`,
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-text-on-gold"
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
                  {!t.isApproved && (
                    <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--crimson-rgb),0.2)", color: "var(--crimson-light)" }}>
                      En attente
                    </span>
                  )}
                </div>
                <p className="font-serif text-sm" style={{ color: "rgba(var(--text-rgb),0.80)", lineHeight: 1.8 }}>
                  {t.content}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!t.isApproved && (
                  <>
                    <button
                      onClick={() => approveTestimonial({ id: t._id })}
                      className="p-2 rounded-lg transition-colors hover:scale-105"
                      style={{ background: "rgba(var(--olive-rgb),0.15)", color: "var(--olive-light)" }}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => rejectTestimonial({ id: t._id })}
                      className="p-2 rounded-lg transition-colors hover:scale-105"
                      style={{ background: "rgba(var(--crimson-light-rgb),0.15)", color: "var(--crimson-light)" }}
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
