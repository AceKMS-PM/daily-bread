import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookOpen } from "lucide-react";

interface DevotionalCardProps {
  devotional: any;
  compact?: boolean;
}

export default function DevotionalCard({ devotional, compact = false }: DevotionalCardProps) {
  const ref = `${devotional.bibleBook} ${devotional.bibleChapter}:${devotional.bibleVerseStart}`;
  const preview = devotional.content?.slice(0, 120) + "...";
  const dateLabel = format(new Date(devotional.scheduledFor), "d MMM yyyy", { locale: fr });

  return (
    <Link
      to={`/devotional/${devotional.scheduledFor}`}
      className="block sacred-card sacred-card-hover rounded-xl overflow-hidden group transition-all duration-300"
    >
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }} />

      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={13} style={{ color: "rgba(201,168,76,0.6)" }} />
            <span className="font-sans text-xs tracking-wide" style={{ color: "rgba(201,168,76,0.7)" }}>
              {ref}
            </span>
          </div>
          <span className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.3)" }}>
            {dateLabel}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display mb-3 group-hover:text-gradient-gold transition-all duration-300"
          style={{ fontSize: "1.3rem", lineHeight: 1.3, color: "#f9f1e0" }}
        >
          {devotional.title}
        </h3>

        {/* Bible verse excerpt */}
        <p
          className="font-serif italic mb-4 text-sm line-clamp-2"
          style={{ color: "rgba(249,241,224,0.55)", lineHeight: 1.7 }}
        >
          {devotional.bibleText?.slice(0, 100)}...
        </p>

        {!compact && (
          <p
            className="font-serif text-sm line-clamp-3"
            style={{ color: "rgba(249,241,224,0.4)", lineHeight: 1.7 }}
          >
            {preview}
          </p>
        )}

        {/* Tags */}
        {devotional.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {devotional.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="font-sans text-xs px-2.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: "rgba(201,168,76,0.7)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read more */}
        <div className="flex items-center gap-1 mt-5 font-sans text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
          <span>Lire la dévotion</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
}
