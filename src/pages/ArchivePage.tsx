import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DevotionalCard from "@/components/devotional/DevotionalCard";
import CrossIcon from "@/components/ui/CrossIcon";

export default function ArchivePage() {
  const devotionals = useQuery(api.devotionals.getRecentDevotionals, { limit: 30 });

  return (
    <div className="px-6 py-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 fade-up">
        <CrossIcon size={32} color="rgba(201,168,76,0.4)" className="mx-auto mb-6" />
        <h1
          className="font-display mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#f9f1e0", fontWeight: 300 }}
        >
          Archives
        </h1>
        <p className="font-serif text-lg" style={{ color: "rgba(249,241,224,0.45)" }}>
          Toutes les dévotions publiées
        </p>
      </div>

      {devotionals === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sacred-card rounded-xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : devotionals.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl" style={{ color: "rgba(249,241,224,0.25)" }}>
            Aucune dévotion pour l'instant
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devotionals.map((d, i) => (
            <div key={d._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <DevotionalCard devotional={d} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
