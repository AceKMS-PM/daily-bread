import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDevotionals() {
  const devotionals = useQuery(api.devotionals.getAllDevotionals);
  const deleteDevotional = useMutation(api.devotionals.deleteDevotional);

  const handleDelete = async (id: any) => {
    if (!confirm("Supprimer cette dévotion ?")) return;
    await deleteDevotional({ id });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-parchment-100">Dévotions</h1>
          <p className="font-sans text-sm mt-1" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
            {devotionals?.length ?? 0} dévotions au total
          </p>
        </div>
        <Link to="/admin/devotionals/new" className="btn-gold flex items-center gap-2">
          <Plus size={16} /> Nouvelle dévotion
        </Link>
      </div>

      {devotionals === undefined ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(var(--gold-rgb),0.05)" }} />
          ))}
        </div>
      ) : devotionals.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl" style={{ color: "rgba(var(--text-rgb),0.40)" }}>
            Aucune dévotion encore créée
          </p>
          <Link to="/admin/devotionals/new" className="btn-gold mt-6 inline-block">
            Créer la première
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {devotionals.map((d) => (
            <div
              key={d._id}
              className="flex items-center gap-4 p-5 rounded-xl transition-all"
              style={{
                background: "rgba(var(--surface-rgb),0.7)",
                border: "1px solid rgba(var(--gold-rgb),0.08)",
              }}
            >
              {/* Date badge */}
              <div
                className="flex-shrink-0 text-center px-3 py-2 rounded-lg"
                style={{ background: "rgba(var(--gold-rgb),0.08)", minWidth: 70 }}
              >
                <p className="font-sans text-xs" style={{ color: "rgba(var(--gold-rgb),0.5)" }}>
                  {format(new Date(d.scheduledFor), "MMM", { locale: fr }).toUpperCase()}
                </p>
                <p className="font-display text-xl" style={{ color: "var(--gold)" }}>
                  {format(new Date(d.scheduledFor), "d")}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-parchment-100 truncate">{d.title}</p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(var(--text-rgb),0.50)" }}>
                  {d.bibleBook} {d.bibleChapter}:{d.bibleVerseStart} · {d.bibleTranslation}
                  {d.author && ` · ${d.author.name}`}
                </p>
              </div>

              {/* Status */}
              <span
                className="font-sans text-xs px-3 py-1 rounded-full flex-shrink-0"
                style={{
                  background:
                    d.status === "published"
                      ? "rgba(var(--olive-rgb),0.15)"
                      : d.status === "scheduled"
                      ? "rgba(var(--gold-rgb),0.1)"
                      : "rgba(var(--white-rgb),0.04)",
                  color:
                    d.status === "published"
                      ? "var(--olive-light)"
                      : d.status === "scheduled"
                      ? "var(--gold)"
                      : "rgba(var(--text-rgb),0.45)",
                  border: `1px solid ${
                    d.status === "published"
                      ? "rgba(var(--olive-rgb),0.3)"
                      : d.status === "scheduled"
                      ? "rgba(var(--gold-rgb),0.2)"
                      : "rgba(var(--white-rgb),0.05)"
                  }`,
                }}
              >
                {d.status === "published" ? "Publié" : d.status === "scheduled" ? "Planifié" : "Brouillon"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/devotional/${d.scheduledFor}`}
                  target="_blank"
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "rgba(var(--text-rgb),0.45)" }}
                >
                  <Eye size={16} />
                </Link>
                <Link
                  to={`/admin/devotionals/${d._id}/edit`}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: "rgba(var(--gold-rgb),0.5)" }}
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(d._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  style={{ color: "rgba(var(--crimson-rgb),0.6)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
