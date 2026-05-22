import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PrayerWallPreview() {
  const prayers = useQuery(api.prayers.getPublicPrayerRequests, { limit: 3 });

  if (!prayers || prayers.length === 0) return null;

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl text-parchment-100">Mur de Prière</h2>
          <p className="font-serif text-sm mt-1" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
            Portez-vous les uns les autres dans la prière
          </p>
        </div>
        <Link
          to="/mur-de-priere"
          className="font-sans text-sm"
          style={{ color: "rgba(var(--gold-rgb),0.7)" }}
        >
          Voir tout →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {prayers.map((p) => (
          <div
            key={p._id}
            className="p-5 rounded-xl"
            style={{
              background: "rgba(var(--gold-rgb),0.04)",
              border: "1px solid rgba(var(--gold-rgb),0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-text-on-gold"
                style={{ background: "var(--gradient-gold)" }}
              >
                {p.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <p className="font-sans text-xs" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
                {format(new Date(p.createdAt), "d MMM", { locale: fr })}
              </p>
            </div>
            <p className="font-serif text-sm mb-4" style={{ color: "rgba(var(--text-rgb),0.80)", lineHeight: 1.7 }}>
              {p.content.slice(0, 120)}{p.content.length > 120 ? "..." : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
