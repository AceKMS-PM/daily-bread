import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, EyeOff } from "lucide-react";

export default function AdminPrayers() {
  const prayers = useQuery(api.prayers.getAllPrayers);
  const toggleHide = useMutation(api.prayers.toggleHidePrayer);

  const handleToggleHide = async (prayerId: any, isHidden: boolean | undefined) => {
    const action = isHidden ? "rendre visible" : "masquer";
    if (!confirm(`Confirmer le ${action} de cette demande de prière ?`)) return;
    await toggleHide({ id: prayerId });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-parchment-100">Prières</h1>
        <p className="font-sans text-sm mt-1" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
          {prayers?.length ?? 0} demandes de prière
        </p>
      </div>

      <div className="space-y-2">
        {prayers?.map((p) => (
          <div
            key={p._id}
            className="flex items-start gap-4 p-5 rounded-xl"
            style={{
              background: p.isHidden ? "rgba(var(--crimson-rgb),0.06)" : "rgba(var(--surface-rgb),0.7)",
              border: `1px solid ${p.isHidden ? "rgba(var(--crimson-rgb),0.15)" : "rgba(var(--gold-rgb),0.08)"}`,
              opacity: p.isHidden ? 0.5 : 1,
            }}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs text-text-on-gold"
              style={{ background: "var(--gradient-gold)" }}
            >
              {(p.user as any)?.name?.[0]?.toUpperCase() ?? "?"}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-sm text-parchment-100">
                  {(p.user as any)?.name ?? "Anonyme"}
                </span>
                <span className="font-sans text-[10px]" style={{ color: "rgba(var(--text-rgb),0.45)" }}>
                  {format(new Date(p.createdAt), "d MMM yyyy, HH:mm", { locale: fr })}
                </span>
                {p.isHidden && (
                  <span className="font-sans text-[10px] uppercase tracking-widest text-crimson-light px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--crimson-rgb),0.15)" }}>
                    Masquée
                  </span>
                )}
                {!p.isPublic && (
                  <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: "rgba(var(--gold-rgb),0.4)" }}>
                    Privée
                  </span>
                )}
              </div>
              <p className="font-serif text-sm leading-relaxed" style={{ color: "rgba(var(--text-rgb),0.85)" }}>
                {p.content}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-sans text-xs" style={{ color: "rgba(var(--text-rgb),0.45)" }}>
                  🙏 {p.prayerCount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleToggleHide(p._id, p.isHidden)}
              className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 flex-shrink-0"
              style={{ color: p.isHidden ? "var(--olive-light)" : "rgba(var(--text-rgb),0.55)" }}
            >
              {p.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
              {p.isHidden ? "Afficher" : "Masquer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
