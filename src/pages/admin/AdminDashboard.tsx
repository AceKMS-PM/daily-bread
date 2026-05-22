import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { BookOpen, Users, Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminDashboard() {
  const allDevotionals = useQuery(api.devotionals.getAllDevotionals);
  const allUsers = useQuery(api.users.getAllUsers);
  const todayDevotional = useQuery(api.devotionals.getTodayDevotional);

  const published = allDevotionals?.filter((d) => d.status === "published").length ?? 0;
  const drafts = allDevotionals?.filter((d) => d.status === "draft").length ?? 0;
  const scheduled = allDevotionals?.filter((d) => d.status === "scheduled").length ?? 0;

  const stats = [
    { label: "Dévotions publiées", value: published, icon: BookOpen, color: "var(--gold)" },
    { label: "Brouillons", value: drafts, icon: Eye, color: "rgba(var(--text-rgb),0.65)" },
    { label: "Planifiées", value: scheduled, icon: Eye, color: "var(--olive)" },
    { label: "Membres", value: allUsers?.length ?? 0, icon: Users, color: "var(--gold)" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl text-parchment-100 mb-1">Tableau de bord</h1>
        <p className="font-sans text-sm" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-6 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(var(--surface-rgb),0.8) 0%, rgba(var(--warm-rgb),0.8) 100%)",
              border: "1px solid rgba(var(--gold-rgb),0.1)",
            }}
          >
            <Icon size={18} style={{ color }} className="mb-3" />
            <p className="font-display text-3xl mb-1" style={{ color }}>
              {value}
            </p>
            <p className="font-sans text-xs" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Today's status */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(var(--surface-rgb),0.8) 0%, rgba(var(--warm-rgb),0.8) 100%)",
            border: "1px solid rgba(var(--gold-rgb),0.15)",
          }}
        >
          <h3 className="font-display text-lg text-parchment-100 mb-4">Dévotion d'aujourd'hui</h3>
          {todayDevotional ? (
            <div>
              <p className="font-serif text-parchment-200 mb-1">{todayDevotional.title}</p>
              <p className="font-sans text-xs" style={{ color: "rgba(var(--gold-rgb),0.7)" }}>
                {todayDevotional.bibleBook} {todayDevotional.bibleChapter}:{todayDevotional.bibleVerseStart}
              </p>
              <div className="flex gap-4 mt-4 text-xs font-sans" style={{ color: "rgba(var(--text-rgb),0.55)" }}>
                <span>👁 {todayDevotional.viewCount} vues</span>
                <span>❤️ {todayDevotional.likeCount}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="font-sans text-sm" style={{ color: "rgba(var(--text-rgb),0.50)" }}>
                Aucune dévotion publiée pour aujourd'hui
              </p>
              <Link to="/admin/devotionals/new" className="btn-gold" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>
                <Plus size={14} className="inline mr-1" />
                Créer maintenant
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(var(--surface-rgb),0.8) 0%, rgba(var(--warm-rgb),0.8) 100%)",
            border: "1px solid rgba(var(--gold-rgb),0.15)",
          }}
        >
          <h3 className="font-display text-lg text-parchment-100 mb-4">Actions rapides</h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/devotionals/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm transition-all"
              style={{
                background: "rgba(var(--gold-rgb),0.1)",
                border: "1px solid rgba(var(--gold-rgb),0.2)",
                color: "var(--gold)",
              }}
            >
              <Plus size={16} />
              Nouvelle dévotion
            </Link>
            <Link
              to="/admin/devotionals"
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm transition-all hover:bg-white/5"
              style={{ color: "rgba(var(--text-rgb),0.65)", border: "1px solid rgba(var(--white-rgb),0.05)" }}
            >
              <BookOpen size={16} />
              Gérer les dévotions
            </Link>
          </div>
        </div>
      </div>

      {/* Recent devotionals */}
      <div>
        <h3 className="font-display text-xl text-parchment-100 mb-5">Dévotions récentes</h3>
        <div className="space-y-2">
          {allDevotionals?.slice(0, 5).map((d) => (
            <div
              key={d._id}
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ background: "rgba(var(--white-rgb),0.02)", border: "1px solid rgba(var(--gold-rgb),0.06)" }}
            >
              <div>
                <p className="font-serif text-parchment-200 text-sm">{d.title}</p>
                <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(var(--text-rgb),0.45)" }}>
                  {d.scheduledFor} · {d.bibleBook} {d.bibleChapter}:{d.bibleVerseStart}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="font-sans text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background:
                      d.status === "published"
                        ? "rgba(var(--olive-rgb),0.2)"
                        : d.status === "scheduled"
                        ? "rgba(var(--gold-rgb),0.15)"
                        : "rgba(var(--white-rgb),0.05)",
                    color:
                      d.status === "published"
                        ? "var(--olive-light)"
                        : d.status === "scheduled"
                        ? "var(--gold)"
                        : "rgba(var(--text-rgb),0.45)",
                  }}
                >
                  {d.status === "published" ? "Publié" : d.status === "scheduled" ? "Planifié" : "Brouillon"}
                </span>
                <Link
                  to={`/admin/devotionals/${d._id}/edit`}
                  className="font-sans text-xs"
                  style={{ color: "rgba(var(--gold-rgb),0.5)" }}
                >
                  Éditer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
