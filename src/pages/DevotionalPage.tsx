import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, BookOpen } from "lucide-react";
import CrossIcon from "@/components/ui/CrossIcon";

export default function DevotionalPage() {
  const { date } = useParams<{ date: string }>();
  const devotional = useQuery(api.devotionals.getDevotionalByDate, { date: date ?? "" });

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

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        to="/"
        className="flex items-center gap-2 font-sans text-sm mb-10 transition-colors"
        style={{ color: "rgba(201,168,76,0.5)" }}
      >
        <ArrowLeft size={16} /> Retour
      </Link>

      {/* Header */}
      <header className="mb-12 fade-up">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={15} style={{ color: "rgba(201,168,76,0.7)" }} />
          <span className="font-sans text-sm tracking-wide" style={{ color: "rgba(201,168,76,0.8)" }}>
            {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
            {devotional.bibleVerseEnd ? `-${devotional.bibleVerseEnd}` : ""} — {devotional.bibleTranslation}
          </span>
        </div>

        <h1
          className="font-display mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15, color: "#f9f1e0", fontWeight: 300 }}
        >
          {devotional.title}
        </h1>

        <p className="font-sans text-sm" style={{ color: "rgba(249,241,224,0.3)", letterSpacing: "0.05em" }}>
          {formattedDate}
          {devotional.author && ` · Par ${devotional.author.name}`}
        </p>
      </header>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)" }} />
        <CrossIcon size={14} color="rgba(201,168,76,0.4)" />
        <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, rgba(201,168,76,0.3), transparent)" }} />
      </div>

      {/* Bible verse */}
      <div className="verse-card mb-10 fade-up animate-delay-100">
        <p className="font-serif italic" style={{ fontSize: "1.2rem", lineHeight: 2, color: "#f9f1e0" }}>
          {devotional.bibleText}
        </p>
        <p className="font-sans text-xs mt-4 tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>
          — {devotional.bibleBook} {devotional.bibleChapter}:{devotional.bibleVerseStart}
        </p>
      </div>

      {/* Main content */}
      <div
        className="font-serif mb-10 fade-up animate-delay-200"
        style={{ fontSize: "1.1rem", lineHeight: 2, color: "rgba(249,241,224,0.75)", whiteSpace: "pre-wrap" }}
      >
        {devotional.content}
      </div>

      {/* Reflection */}
      {devotional.reflection && (
        <div
          className="p-6 rounded-xl mb-8 fade-up animate-delay-300"
          style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)" }}
        >
          <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(201,168,76,0.7)" }}>
            ✦ Réflexion
          </p>
          <p className="font-serif" style={{ color: "rgba(249,241,224,0.65)", lineHeight: 1.9 }}>
            {devotional.reflection}
          </p>
        </div>
      )}

      {/* Prayer */}
      {devotional.prayer && (
        <div
          className="p-6 rounded-xl mb-10 fade-up animate-delay-400"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.03) 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(201,168,76,0.7)" }}>
            ✝ Prière
          </p>
          <p className="font-serif italic" style={{ color: "rgba(249,241,224,0.7)", lineHeight: 1.9 }}>
            {devotional.prayer}
          </p>
        </div>
      )}

      {/* Tags */}
      {devotional.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
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

      {/* Bottom nav */}
      <div className="flex justify-between pt-10 mt-10" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <Link to="/archives" className="font-sans text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
          ← Toutes les dévotions
        </Link>
        <Link to="/" className="font-sans text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
          Accueil →
        </Link>
      </div>
    </article>
  );
}
