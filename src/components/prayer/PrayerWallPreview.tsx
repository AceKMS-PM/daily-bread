import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { HandIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PrayerWallPreview() {
  const prayers = useQuery(api.prayers.getPublicPrayerRequests, { limit: 3 });
  const prayFor = useMutation(api.prayers.prayForRequest);
  const { isAuthenticated } = useConvexAuth();

  if (!prayers || prayers.length === 0) return null;

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl text-parchment-100">Mur de Prière</h2>
          <p className="font-serif text-sm mt-1" style={{ color: "rgba(249,241,224,0.4)" }}>
            Portez-vous les uns les autres dans la prière
          </p>
        </div>
        <Link
          to="/mur-de-priere"
          className="font-sans text-sm"
          style={{ color: "rgba(201,168,76,0.7)" }}
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
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-sacred-dark"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}
              >
                {p.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <p className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.4)" }}>
                {format(new Date(p.createdAt), "d MMM", { locale: fr })}
              </p>
            </div>
            <p className="font-serif text-sm mb-4" style={{ color: "rgba(249,241,224,0.65)", lineHeight: 1.7 }}>
              {p.content.slice(0, 120)}{p.content.length > 120 ? "..." : ""}
            </p>
            <button
              onClick={() => prayFor({ id: p._id })}
              className="flex items-center gap-2 font-sans text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(201,168,76,0.8)",
              }}
            >
              🙏 Prier ({p.prayerCount})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
