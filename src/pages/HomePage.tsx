import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";
import { DEFAULT_IMAGES } from "@/constants/images";
import { DevotionCardLarge } from "@/components/devotional/DevotionalCard";

export default function HomePage() {
  const todayDevotional = useQuery(api.devotionals.getTodayDevotional);
  const recentDevotionals = useQuery(api.devotionals.getRecentDevotionals, { limit: 10 });
  const announcements = useQuery(api.announcements.getAnnouncements);

  return (
    <div>
      {/* Announcement Banner */}
      {announcements && announcements.length > 0 && (
        <section className="px-6 py-4 max-w-4xl mx-auto pt-24">
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

      {/* Verse of the Day Hero */}
      <section className="py-16 md:py-24 px-6 flex justify-center"
        style={{ background: "linear-gradient(180deg, rgba(13,10,6,0.5) 0%, rgba(26,19,8,0.3) 100%)" }}
      >
        {todayDevotional === undefined ? (
          <div className="w-full max-w-3xl">
            <div className="rounded-xl p-10 md:p-16 text-center animate-pulse"
              style={{ background: "rgba(42,31,14,0.5)", border: "1px solid rgba(201,168,76,0.08)" }}
            >
              <div className="h-24 w-3/4 mx-auto rounded" style={{ background: "rgba(201,168,76,0.05)" }} />
              <div className="h-4 w-48 mx-auto mt-8 rounded" style={{ background: "rgba(201,168,76,0.05)" }} />
            </div>
          </div>
        ) : todayDevotional === null ? (
          <div className="w-full max-w-3xl">
            <div className="rounded-xl p-10 md:p-16 text-center"
              style={{ background: "rgba(42,31,14,0.5)", border: "1px solid rgba(201,168,76,0.08)" }}
            >
              <CrossIcon size={40} color="rgba(201,168,76,0.2)" className="mx-auto mb-6" />
              <div className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
                Verset du Jour
              </div>
              <p className="font-serif text-xl italic" style={{ color: "rgba(249,241,224,0.4)", lineHeight: 1.8 }}>
                « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
              </p>
              <div className="font-sans text-xs tracking-widest uppercase mt-6" style={{ color: "rgba(201,168,76,0.5)" }}>
                Psaume 119:105
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl fade-up">
            <div
              className="rounded-xl p-10 md:p-16 text-center shadow-gold relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(42,31,14,0.6) 0%, rgba(26,19,8,0.8) 100%)",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <div
                className="absolute -top-6 -left-6 font-display select-none pointer-events-none"
                style={{ fontSize: "clamp(4rem, 15vw, 10rem)", color: "rgba(201,168,76,0.04)", lineHeight: 1 }}
              >
                "
              </div>
              <div className="relative z-10">
                <div className="font-sans text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(201,168,76,0.6)" }}>
                  {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                </div>
                <p
                  className="font-serif italic mb-8 leading-relaxed"
                  style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: "#f9f1e0", lineHeight: 1.8 }}
                >
                  « {todayDevotional.bibleText} »
                </p>
                <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.7)" }}>
                  — {todayDevotional.bibleBook} {todayDevotional.bibleChapter}:{todayDevotional.bibleVerseStart}
                  {todayDevotional.bibleVerseEnd ? `-${todayDevotional.bibleVerseEnd}` : ""} · {todayDevotional.bibleTranslation}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Devotion of the Day */}
          <section className="lg:col-span-8">
            <h2
              className="font-display text-2xl mb-8"
              style={{ color: "#C9A84C", borderLeft: "2px solid rgba(201,168,76,0.4)", paddingLeft: "1rem" }}
            >
              Dévotion du Jour
            </h2>
            {todayDevotional && <DevotionCardLarge devotional={todayDevotional} />}
          </section>

          {/* Prayers Sidebar */}
          <aside className="lg:col-span-4">
            <PrayerSidebar />
          </aside>
        </div>

        {/* Recent Devotionals — Asymmetric Grid */}
        {recentDevotionals && recentDevotionals.length > 1 && (
          <section className="mt-24">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2
                  className="font-display text-2xl mb-2"
                  style={{ color: "#C9A84C", borderLeft: "2px solid rgba(201,168,76,0.4)", paddingLeft: "1rem" }}
                >
                  Dévotions Récentes
                </h2>
                <p className="font-serif text-base" style={{ color: "rgba(249,241,224,0.4)" }}>
                  Parcours la Parole de Dieu au fil des jours.
                </p>
              </div>
              <Link
                to="/archives"
                className="hidden md:flex items-center gap-2 font-sans text-sm uppercase tracking-widest border px-6 py-2 rounded hover:bg-white/5 transition-colors"
                style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.2)" }}
              >
                Voir toutes <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentDevotionals.slice(0, 3).map((d, i) => (
                <div key={d._id} className={i === 1 ? "md:mt-12" : ""}>
                  <DevotionalCardSmall devotional={d} index={i} />
                </div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link
                to="/archives"
                className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest border px-6 py-3 rounded-lg"
                style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.2)" }}
              >
                Voir toutes les dévotions <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function PrayerSidebar() {
  const prayers = useQuery(api.prayers.getPublicPrayerRequests, { limit: 3 });
  const prayFor = useMutation(api.prayers.togglePrayed);

  if (!prayers || prayers.length === 0) return null;

  return (
    <div>
      <h2
        className="font-display text-2xl mb-8"
        style={{ color: "#C9A84C", borderLeft: "2px solid rgba(201,168,76,0.4)", paddingLeft: "1rem" }}
      >
        Let's Pray
      </h2>
      <div className="space-y-4">
        {prayers.map((p: any) => (
          <div
            key={p._id}
            className="p-6 rounded-lg transition-colors cursor-pointer group"
            style={{
              background: "rgba(26,19,8,0.6)",
              border: "1px solid rgba(201,168,76,0.08)",
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-sans text-[12px]" style={{ color: "#C9A84C" }}>
                PRAY
              </span>
              <span className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.3)" }}>
                {format(new Date(p.createdAt), "d MMM", { locale: fr })}
              </span>
            </div>
            <p className="font-serif text-sm mb-4 line-clamp-3" style={{ color: "rgba(249,241,224,0.65)", lineHeight: 1.7 }}>
              {p.content}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.35)" }}>
                {p.user?.name ?? "Anonyme"}
              </span>
              <button
                onClick={() => prayFor({ id: p._id })}
                className="flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                style={{ color: "#C9A84C" }}
              >
                <span className="font-sans text-xs">AMEN</span>
                {p.prayerCount > 0 && (
                  <span className="font-sans text-xs">({p.prayerCount})</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/mur-de-priere"
        className="block text-center py-4 font-sans text-xs tracking-widest uppercase hover:underline"
        style={{ color: "rgba(201,168,76,0.7)" }}
      >
        Voir toutes les prières →
      </Link>
    </div>
  );
}

function DevotionalCardSmall({ devotional, index }: { devotional: any; index: number }) {
  const images = [
    DEFAULT_IMAGES.ARCHIVE_CARD_1,
    DEFAULT_IMAGES.ARCHIVE_CARD_2,
    DEFAULT_IMAGES.ARCHIVE_CARD_3,
  ];
  const img = devotional.coverImage || images[index % images.length];
  const tag = devotional.tags?.[0] ?? "Dévotion";

  return (
    <Link to={`/devotional/${devotional.scheduledFor}`} className="group cursor-pointer block">
      <div className="aspect-square bg-sacred-deeper rounded-xl overflow-hidden mb-4 relative"
        style={{ border: "1px solid rgba(201,168,76,0.1)" }}
      >
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sacred-deeper to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <span className="font-sans text-[10px] text-gold-light uppercase tracking-widest">{tag}</span>
          <h4 className="font-display text-xl text-parchment-100 leading-tight mt-1">{devotional.title}</h4>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-sans text-xs tracking-wide" style={{ color: "rgba(201,168,76,0.6)" }}>
          {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
        </span>
      </div>
      <p className="font-serif text-sm line-clamp-2" style={{ color: "rgba(249,241,224,0.4)", lineHeight: 1.6 }}>
        {devotional.content?.slice(0, 100)}...
      </p>
    </Link>
  );
}
