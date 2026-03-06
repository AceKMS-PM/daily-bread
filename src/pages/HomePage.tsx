import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Flame, Heart, Hand } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";
import DevotionalCard from "@/components/devotional/DevotionalCard";
import PrayerWallPreview from "@/components/prayer/PrayerWallPreview";

const REACTIONS = [
  { type: "amen" as const, label: "Amen", emoji: "🙏" },
  { type: "heart" as const, label: "Amour", emoji: "❤️" },
  { type: "fire" as const, label: "Feu", emoji: "🔥" },
  { type: "pray" as const, label: "Prière", emoji: "✝️" },
];

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  const todayDevotional = useQuery(api.devotionals.getTodayDevotional);
  const recentDevotionals = useQuery(api.devotionals.getRecentDevotionals, { limit: 4 });
  const announcements = useQuery(api.announcements.getAnnouncements);

  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Date badge */}
        <div
          className="fade-up mb-8 px-5 py-2 rounded-full font-sans text-xs tracking-widest uppercase"
          style={{
            border: "1px solid rgba(201,168,76,0.3)",
            color: "rgba(201,168,76,0.8)",
            background: "rgba(201,168,76,0.05)",
          }}
        >
          {formattedDate}
        </div>

        {/* Title */}
        <h1
          className="fade-up animate-delay-100 font-display text-center mb-4"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: "1.05",
            fontWeight: 300,
            color: "#f9f1e0",
          }}
        >
          <span className="text-gradient-gold">Pain</span>{" "}
          <br className="sm:hidden" />
          Quotidien
        </h1>

        <div className="fade-up animate-delay-200 flex items-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-DEFAULT opacity-40" />
          <CrossIcon size={16} color="rgba(201,168,76,0.5)" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-DEFAULT opacity-40" />
        </div>

        <p
          className="fade-up animate-delay-300 font-serif text-center max-w-lg mb-12"
          style={{ color: "rgba(249,241,224,0.5)", fontSize: "1.1rem", lineHeight: 1.8 }}
        >
          Nourris ton âme chaque jour de la Parole vivante de Dieu.
          <br />
          Dévotions et versets pour ta marche avec Christ.
        </p>

        {/* Scroll cue */}
        <div
          className="fade-up animate-delay-500 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => document.getElementById("devotion-du-jour")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>
            Dévotion du jour
          </span>
          <div className="w-px h-12" style={{ background: "linear-gradient(180deg, rgba(201,168,76,0.5) 0%, transparent 100%)" }} />
        </div>
      </section>

      {/* Announcement Banner */}
      {announcements && announcements.length > 0 && (
        <section className="px-6 py-4 max-w-4xl mx-auto">
          {announcements
            .filter((a) => a.isPinned)
            .slice(0, 1)
            .map((ann) => (
              <div
                key={ann._id}
                className="px-6 py-4 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
              >
                <p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.7)" }}>
                  Annonce
                </p>
                <p className="font-display text-lg text-parchment-100">{ann.title}</p>
                <p className="font-serif text-sm text-parchment-200/60 mt-1">{ann.content}</p>
              </div>
            ))}
        </section>
      )}

      {/* Today's Devotional */}
      <section id="devotion-du-jour" className="px-6 py-16 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="cross-divider flex-1">
            <h2 className="font-display text-3xl text-parchment-100 whitespace-nowrap">
              Dévotion du Jour
            </h2>
          </div>
        </div>

        {todayDevotional === undefined ? (
          <TodayDevotionalSkeleton />
        ) : todayDevotional === null ? (
          <EmptyDevotional />
        ) : (
          <TodayDevotionalFull devotional={todayDevotional} />
        )}
      </section>

      {/* Recent Devotionals */}
      {recentDevotionals && recentDevotionals.length > 1 && (
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl text-parchment-100">Dévotions Récentes</h2>
            <Link
              to="/archives"
              className="flex items-center gap-1 font-sans text-sm"
              style={{ color: "rgba(201,168,76,0.7)" }}
            >
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDevotionals.slice(1, 4).map((d) => (
              <DevotionalCard key={d._id} devotional={d} />
            ))}
          </div>
        </section>
      )}

      {/* Prayer Wall Preview */}
      <PrayerWallPreview />
    </div>
  );
}

function TodayDevotionalFull({ devotional }: { devotional: any }) {
  const userReactions = useQuery(api.devotionals.getUserReactions, { devotionalId: devotional._id });

  return (
    <div className="sacred-card p-8 md:p-12 rounded-2xl" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
      {/* Bible reference badge */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={16} style={{ color: "rgba(201,168,76,0.7)" }} />
        <span className="font-sans text-sm tracking-wide" style={{ color: "rgba(201,168,76,0.8)" }}>
          {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
          {devotional.bibleVerseEnd ? `-${devotional.bibleVerseEnd}` : ""} — {devotional.bibleTranslation}
        </span>
      </div>

      {/* Title */}
      <h2 className="font-display mb-6" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#f9f1e0", lineHeight: 1.2 }}>
        {devotional.title}
      </h2>

      {/* Bible verse */}
      <div className="verse-card mb-8">
        <p className="font-serif italic" style={{ fontSize: "1.2rem", lineHeight: 2, color: "#f9f1e0" }}>
          {devotional.bibleText}
        </p>
        <p className="font-sans text-xs mt-4 tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>
          — {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
        </p>
      </div>

      {/* Content */}
      <div
        className="font-serif mb-8 prose-devotional"
        style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "rgba(249,241,224,0.75)", whiteSpace: "pre-wrap" }}
      >
        {devotional.content}
      </div>

      {/* Prayer */}
      {devotional.prayer && (
        <div
          className="p-6 rounded-xl mb-8"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(201,168,76,0.7)" }}>
            ✝ Prière
          </p>
          <p className="font-serif italic" style={{ color: "rgba(249,241,224,0.7)", lineHeight: 1.9 }}>
            {devotional.prayer}
          </p>
        </div>
      )}

      {/* Author */}
      {devotional.author && (
        <div className="flex items-center gap-3 mb-8 pt-6 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-sacred-dark"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}
          >
            {devotional.author.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-sans text-sm text-parchment-100">{devotional.author.name}</p>
            <p className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.35)" }}>
              {format(new Date(devotional.scheduledFor), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
      )}

      {/* Reactions */}
      <div className="flex flex-wrap gap-3">
        {REACTIONS.map(({ type, label, emoji }) => {
          const hasReacted = userReactions?.some((r) => r.type === type);
          return (
            <ReactionButton
              key={type}
              devotionalId={devotional._id}
              type={type}
              label={label}
              emoji={emoji}
              active={hasReacted ?? false}
            />
          );
        })}
      </div>
    </div>
  );
}

function ReactionButton({ devotionalId, type, label, emoji, active }: any) {
  const { useMutation } = require("convex/react");
  const toggle = useMutation(api.devotionals.toggleReaction);

  return (
    <button
      onClick={() => toggle({ devotionalId, type })}
      className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-sm transition-all duration-200"
      style={{
        background: active ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: active ? "#C9A84C" : "rgba(249,241,224,0.5)",
        transform: active ? "scale(1.05)" : "scale(1)",
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function TodayDevotionalSkeleton() {
  return (
    <div className="sacred-card p-10 rounded-2xl animate-pulse">
      <div className="h-4 w-48 rounded mb-8" style={{ background: "rgba(201,168,76,0.1)" }} />
      <div className="h-12 w-3/4 rounded mb-4" style={{ background: "rgba(201,168,76,0.1)" }} />
      <div className="h-32 w-full rounded mb-8" style={{ background: "rgba(201,168,76,0.05)" }} />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 rounded" style={{ background: "rgba(201,168,76,0.05)", width: `${100 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

function EmptyDevotional() {
  return (
    <div className="text-center py-20">
      <CrossIcon size={40} color="rgba(201,168,76,0.2)" className="mx-auto mb-6" />
      <h3 className="font-display text-2xl text-parchment-200/40 mb-3">Aucune dévotion aujourd'hui</h3>
      <p className="font-serif" style={{ color: "rgba(249,241,224,0.25)" }}>
        Revenez bientôt — la Parole sera là.
      </p>
    </div>
  );
}
