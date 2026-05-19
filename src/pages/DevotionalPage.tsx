import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";
import { DEFAULT_IMAGES } from "@/constants/images";

const REACTION_CONFIG = [
  { type: "amen" as const, label: "AMEN" },
  { type: "heart" as const, label: "HEART" },
  { type: "fire" as const, label: "FIRE" },
  { type: "pray" as const, label: "PRAY" },
];

const REACTION_SVG: Record<string, (_active: boolean, color: string) => JSX.Element> = {
  amen: (_active, color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  heart: (active, color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  fire: (_active, color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  pray: (_active, color) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4z" />
      <path d="M4 22v-4a8 8 0 0 1 16 0v4" />
      <path d="M8 14h8" />
    </svg>
  ),
};

export default function DevotionalPage() {
  const { date } = useParams<{ date: string }>();
  const { isAuthenticated } = useConvexAuth();
  const devotional = useQuery(api.devotionals.getDevotionalByDate, { date: date ?? "" });
  const recentDevotionals = useQuery(api.devotionals.getRecentDevotionals, { limit: 5 });
  const reactionCounts = useQuery(
    api.devotionals.getReactionCounts,
    devotional ? { devotionalId: devotional._id } : "skip"
  );
  const toggleReaction = useMutation(api.devotionals.toggleReaction);
  const currentUser = useQuery(api.users.getCurrentUser);
  const comments = useQuery(
    api.comments.getCommentsByDevotional,
    devotional ? { devotionalId: devotional._id } : "skip"
  );
  const createComment = useMutation(api.comments.createComment);
  const deleteComment = useMutation(api.comments.deleteMyComment);
  const [commentText, setCommentText] = useState("");
  const [commentAnon, setCommentAnon] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  if (devotional === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div style={{ animation: "float 2s ease-in-out infinite" }}>
          <CrossIcon size={40} color="rgba(201,168,76,0.3)" />
        </div>
      </div>
    );
  }

  if (devotional === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <CrossIcon size={40} color="rgba(201,168,76,0.2)" />
        <h2 className="font-display text-2xl" style={{ color: "rgba(249,241,224,0.4)" }}>
          Dévotion introuvable
        </h2>
        <Link to="/" className="btn-ghost" style={{ padding: "0.5rem 1.5rem" }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(devotional.scheduledFor), "EEEE d MMMM yyyy", { locale: fr });
  const related = (recentDevotionals ?? [])
    .filter((d) => d._id !== devotional._id)
    .slice(0, 2);

  return (
    <article>
      {/* Hero Image Section */}
      <section className="relative w-full h-[400px] md:h-[614px] overflow-hidden">
        <img
          src={devotional.coverImage || DEFAULT_IMAGES.DEVOTIONAL_HERO}
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26, 19, 8, 0) 0%, rgba(22, 19, 14, 0.9) 80%, #16130e 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-12 px-6">
          <div className="w-full max-w-3xl text-center">
            <span
              className="font-sans text-xs tracking-widest uppercase mb-4 block"
              style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.2em" }}
            >
              {formattedDate}
            </span>
            <h1
              className="font-display mb-2"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f9f1e0", lineHeight: 1.1 }}
            >
              {devotional.title}
            </h1>
            <p
              className="font-serif italic"
              style={{ fontSize: "1.1rem", color: "rgba(201,168,76,0.7)" }}
            >
              {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
              {devotional.bibleVerseEnd ? `-${devotional.bibleVerseEnd}` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Back */}
        <Link
          to="/"
          className="flex items-center gap-2 font-sans text-sm transition-colors"
          style={{ color: "rgba(201,168,76,0.5)" }}
        >
          <ArrowLeft size={16} /> Retour
        </Link>

        {/* Verse of the Day Card */}
        <div
          className="rounded-xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(26,19,8,0.6) 0%, rgba(42,31,14,0.4) 100%)",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
        >
          <div
            className="absolute -top-4 -left-4 font-display select-none pointer-events-none"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 1, color: "rgba(201,168,76,0.05)" }}
          >
            "
          </div>
          <div className="relative z-10 text-center">
            <blockquote
              className="font-serif italic mb-6 leading-relaxed"
              style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "#f9f1e0", lineHeight: 1.8 }}
            >
              « {devotional.bibleText} »
            </blockquote>
            <cite
              className="font-sans text-xs tracking-widest uppercase not-italic"
              style={{ color: "rgba(201,168,76,0.7)" }}
            >
              — {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
              {devotional.bibleVerseEnd ? `-${devotional.bibleVerseEnd}` : ""} · {devotional.bibleTranslation}
            </cite>
          </div>
        </div>

        {/* Devotional Text */}
        <div className="space-y-8">
          <div
            className="font-serif leading-relaxed"
            style={{ fontSize: "1.1rem", color: "rgba(249,241,224,0.75)", lineHeight: 1.9, whiteSpace: "pre-wrap" }}
          >
            {devotional.content}
          </div>
        </div>

        {/* Reflection & Prayer */}
        <div className="grid grid-cols-1 gap-8 pt-8">
          {devotional.reflection && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.15)" }} />
                <h2
                  className="font-sans text-xs tracking-widest uppercase"
                  style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.2em" }}
                >
                  Réflexion
                </h2>
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.15)" }} />
              </div>
              <div
                className="p-6 rounded-lg italic"
                style={{
                  background: "rgba(42,31,14,0.3)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  color: "rgba(249,241,224,0.65)",
                  lineHeight: 1.8,
                }}
              >
                {devotional.reflection}
              </div>
            </section>
          )}

          {devotional.prayer && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.15)" }} />
                <h2
                  className="font-sans text-xs tracking-widest uppercase"
                  style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.2em" }}
                >
                  Prière
                </h2>
                <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.15)" }} />
              </div>
              <div
                className="font-serif leading-relaxed text-center px-4"
                style={{ fontSize: "1.05rem", color: "rgba(249,241,224,0.6)", lineHeight: 1.9 }}
              >
                {devotional.prayer}
              </div>
            </section>
          )}
        </div>

        {/* Tags */}
        {devotional.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {devotional.tags.map((tag: string) => (
              <span
                key={tag}
                className="font-sans text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.18)",
                  color: "rgba(201,168,76,0.7)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Reactions Bar */}
        <div
          className="flex justify-center items-center gap-6 md:gap-8 py-12"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
        >
          {REACTION_CONFIG.map(({ type, label }) => {
            const count = reactionCounts?.counts[type] ?? 0;
            const hasCount = count > 0;
            return (
              <button
                key={type}
                onClick={() => {
                  if (!isAuthenticated) return;
                  toggleReaction({ devotionalId: devotional._id, type });
                }}
                className="flex flex-col items-center gap-2 group transition-all"
                style={{ cursor: isAuthenticated ? "pointer" : "default" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  style={{
                    border: `1px solid ${hasCount ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"}`,
                    background: hasCount ? "rgba(42,31,14,0.6)" : "transparent",
                  }}
                >
                  {REACTION_SVG[type](hasCount, hasCount ? "#C9A84C" : "rgba(201,168,76,0.5)")}
                </div>
                <span
                  className="font-sans text-[10px] tracking-tighter"
                  style={{ color: hasCount ? "rgba(201,168,76,0.9)" : "rgba(201,168,76,0.4)" }}
                >
                  {label}
                </span>
                <span
                  className="font-sans text-xs tabular-nums -mt-1"
                  style={{ color: hasCount ? "#C9A84C" : "rgba(201,168,76,0.3)" }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Share */}
        <div className="pt-6 pb-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "rgba(249,241,224,0.3)" }}>
              Partager
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(devotional.title)}&url=${encodeURIComponent(window.location.origin + "/devotional/" + devotional.scheduledFor)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-sans px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(249,241,224,0.5)" }}
            >
              X / Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + "/devotional/" + devotional.scheduledFor)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-sans px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(249,241,224,0.5)" }}
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(devotional.title + " " + window.location.origin + "/devotional/" + devotional.scheduledFor)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-sans px-3 py-1.5 rounded-lg transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(249,241,224,0.5)" }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Author */}
        {devotional.author && (
          <div className="flex items-center gap-3 pt-6" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
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

        {/* Related Devotionals */}
        {related.length > 0 && (
          <section className="pt-8">
            <h3
              className="font-display text-xl mb-8"
              style={{ color: "#f9f1e0" }}
            >
              Aller plus loin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((d) => (
                <Link
                  key={d._id}
                  to={`/devotional/${d.scheduledFor}`}
                  className="group rounded-xl p-6 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(180deg, rgba(26,19,8,0.6) 0%, rgba(42,31,14,0.4) 100%)",
                    border: "1px solid rgba(201,168,76,0.1)",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.7)" }}>
                      Dévotion
                    </span>
                    <span
                      className="font-sans text-sm transition-colors group-hover:translate-x-0.5 transition-transform"
                      style={{ color: "rgba(201,168,76,0.4)" }}
                    >
                      →
                    </span>
                  </div>
                  <h4 className="font-display text-lg mb-2 text-parchment-100">{d.title}</h4>
                  <p className="font-serif text-sm line-clamp-2" style={{ color: "rgba(249,241,224,0.5)" }}>
                    {d.content?.slice(0, 120)}...
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <section className="pt-12">
          <h3
            className="font-display text-xl mb-8"
            style={{ color: "#f9f1e0" }}
          >
            Commentaires
          </h3>

          {isAuthenticated ? (
            <div
              className="p-6 rounded-xl mb-8"
              style={{
                background: "rgba(26,19,8,0.6)",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={3}
                className="w-full bg-transparent border rounded-lg p-4 font-serif text-sm resize-none outline-none transition-colors mb-4"
                style={{
                  borderColor: "rgba(201,168,76,0.2)",
                  color: "rgba(249,241,224,0.75)",
                  lineHeight: 1.8,
                }}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="w-10 h-6 rounded-full relative transition-colors duration-200"
                    style={{ background: commentAnon ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)" }}
                    onClick={() => setCommentAnon(!commentAnon)}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                      style={{
                        background: commentAnon ? "#C9A84C" : "rgba(255,255,255,0.5)",
                        transform: commentAnon ? "translateX(18px)" : "translateX(4px)",
                      }}
                    />
                  </div>
                  <span className="font-sans text-sm" style={{ color: "rgba(249,241,224,0.5)" }}>
                    Rester anonyme
                  </span>
                </label>
                <button
                  onClick={async () => {
                    if (!commentText.trim() || !devotional) return;
                    setCommentSubmitting(true);
                    try {
                      await createComment({ devotionalId: devotional._id, content: commentText, isAnonymous: commentAnon });
                      setCommentText("");
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setCommentSubmitting(false);
                    }
                  }}
                  disabled={commentSubmitting || !commentText.trim()}
                  className="btn-gold font-sans text-xs"
                  style={{ padding: "0.5rem 1.5rem", opacity: commentSubmitting || !commentText.trim() ? 0.5 : 1 }}
                >
                  {commentSubmitting ? "..." : "Commenter"}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="p-6 rounded-xl mb-8 text-center"
              style={{ border: "1px dashed rgba(201,168,76,0.2)" }}
            >
              <p className="font-serif text-sm" style={{ color: "rgba(249,241,224,0.4)" }}>
                Connecte-toi pour ajouter un commentaire.
              </p>
            </div>
          )}

          {comments === undefined ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl p-5 h-24 animate-pulse" style={{ background: "rgba(26,19,8,0.6)" }} />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="font-serif text-sm text-center py-8" style={{ color: "rgba(249,241,224,0.25)" }}>
              Aucun commentaire pour l'instant.
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-xl relative group"
                  style={{
                    background: "rgba(201,168,76,0.03)",
                    border: "1px solid rgba(201,168,76,0.08)",
                  }}
                >
                  {currentUser?._id === c.userId && (
                    <button
                      onClick={async () => { if (confirm("Supprimer ce commentaire ?")) await deleteComment({ id: c._id }); }}
                      className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "rgba(196,68,68,0.6)" }}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-sacred-dark flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)" }}
                    >
                      {c.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="font-sans text-sm text-parchment-100">{c.user?.name ?? "Anonyme"}</p>
                      <p className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.3)" }}>
                        {format(new Date(c.createdAt), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed" style={{ color: "rgba(249,241,224,0.65)", lineHeight: 1.8 }}>
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <div
          className="flex justify-between pt-10"
          style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
        >
          <Link to="/archives" className="font-sans text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
            ← Toutes les dévotions
          </Link>
          <Link to="/" className="font-sans text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
            Accueil →
          </Link>
        </div>
      </div>
    </article>
  );
}
