import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DevotionalCard from "@/components/devotional/DevotionalCard";
import CrossIcon from "@/components/ui/CrossIcon";

export default function ArchivePage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const allTags = useQuery(api.devotionals.getAllTags);
  const devotionals = useQuery(api.devotionals.getRecentDevotionals, {
    limit: 30,
    ...(selectedTag ? { tag: selectedTag } : {}),
  });

  return (
    <div className="px-6 py-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 fade-up">
        <CrossIcon size={32} color="rgba(var(--gold-rgb),0.4)" className="mx-auto mb-6" />
        <h1
          className="font-display mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--parchment-100)", fontWeight: 300 }}
        >
          Archives
        </h1>
        <p className="font-serif text-lg" style={{ color: "rgba(var(--text-rgb),0.60)" }}>
          Toutes les dévotions publiées
        </p>
      </div>

      {/* Tags Filter */}
      {allTags && allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedTag(null)}
            className="font-sans text-xs px-4 py-1.5 rounded-full transition-all"
            style={{
              background: !selectedTag ? "rgba(var(--gold-rgb),0.12)" : "rgba(var(--gold-rgb),0.04)",
              border: `1px solid ${!selectedTag ? "rgba(var(--gold-rgb),0.4)" : "rgba(var(--gold-rgb),0.1)"}`,
              color: !selectedTag ? "var(--gold)" : "rgba(var(--text-rgb),0.65)",
            }}
          >
            Tous
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => setSelectedTag(tag.name)}
              className="font-sans text-xs px-4 py-1.5 rounded-full transition-all"
              style={{
                background: selectedTag === tag.name ? "rgba(var(--gold-rgb),0.12)" : "rgba(var(--gold-rgb),0.04)",
                border: `1px solid ${selectedTag === tag.name ? "rgba(var(--gold-rgb),0.4)" : "rgba(var(--gold-rgb),0.1)"}`,
                color: selectedTag === tag.name ? "var(--gold)" : "rgba(var(--text-rgb),0.65)",
              }}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      )}

      {devotionals === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sacred-card rounded-xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : devotionals.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl" style={{ color: "rgba(var(--text-rgb),0.40)" }}>
            {selectedTag ? "Aucune dévotion avec ce tag" : "Aucune dévotion pour l'instant"}
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
