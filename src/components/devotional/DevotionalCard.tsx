import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DEFAULT_IMAGES } from "@/constants/images";

interface DevotionalCardProps {
  devotional: any;
  compact?: boolean;
}

function getDefaultImage(index: number): string {
  const images = [
    DEFAULT_IMAGES.ARCHIVE_CARD_1,
    DEFAULT_IMAGES.ARCHIVE_CARD_2,
    DEFAULT_IMAGES.ARCHIVE_CARD_3,
    DEFAULT_IMAGES.DEVOTION_CARD,
  ];
  return images[index % images.length];
}

export default function DevotionalCard({ devotional, compact = false }: DevotionalCardProps) {
  const ref = `${devotional.bibleBook} ${devotional.bibleChapter}:${devotional.bibleVerseStart}`;
  const dateLabel = format(new Date(devotional.scheduledFor), "d MMM yyyy", { locale: fr });
  const tag = devotional.tags?.[0] ?? "Dévotion";

  return (
    <Link
      to={`/devotional/${devotional.scheduledFor}`}
      className={`group cursor-pointer block ${compact ? "" : ""}`}
    >
      <div className="aspect-square bg-sacred-deeper rounded-xl overflow-hidden border relative"
        style={{ borderColor: "rgba(201,168,76,0.1)" }}
      >
        <img
          src={devotional.coverImage || getDefaultImage(devotional._id?.charCodeAt(0) ?? 0)}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sacred-deeper to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="font-sans text-[10px] text-gold-light uppercase tracking-widest">
            {tag}
          </span>
          <h4 className="font-display text-xl text-parchment-100 leading-tight mt-1">
            {devotional.title}
          </h4>
        </div>
      </div>
      {!compact && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-sans text-xs tracking-wide" style={{ color: "rgba(201,168,76,0.7)" }}>
              {ref}
            </span>
            <span className="font-sans text-xs" style={{ color: "rgba(249,241,224,0.3)" }}>
              {dateLabel}
            </span>
          </div>
          <p className="font-serif text-sm line-clamp-2" style={{ color: "rgba(249,241,224,0.5)", lineHeight: 1.6 }}>
            {devotional.content?.slice(0, 120)}...
          </p>
        </div>
      )}
    </Link>
  );
}

export function DevotionCardLarge({ devotional }: { devotional: any }) {
  const dateLabel = format(new Date(devotional.scheduledFor), "d MMMM yyyy", { locale: fr });
  const tag = devotional.tags?.[0] ?? "Dévotion";

  return (
    <Link
      to={`/devotional/${devotional.scheduledFor}`}
      className="group block bg-gradient-to-b from-sacred-deeper to-sacred-warm border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-gold-sm hover:-translate-y-1"
      style={{ borderColor: "rgba(201,168,76,0.15)" }}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={devotional.coverImage || DEFAULT_IMAGES.DEVOTION_CARD}
          alt=""
          className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <span
            className="bg-sacred-mid px-3 py-1 rounded-full font-sans text-[10px] tracking-widest uppercase border"
            style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.15)" }}
          >
            {tag}
          </span>
          <span className="font-sans text-xs italic" style={{ color: "rgba(249,241,224,0.4)" }}>
            {dateLabel}
          </span>
        </div>
        <h3
          className="font-display mb-4 group-hover:text-gradient-gold transition-all duration-300"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#f9f1e0", lineHeight: 1.2 }}
        >
          {devotional.title}
        </h3>
        <p className="font-serif text-base line-clamp-3 mb-8" style={{ color: "rgba(249,241,224,0.5)", lineHeight: 1.7 }}>
          {devotional.content?.slice(0, 200)}...
        </p>
        <div
          className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest px-8 py-3 rounded-lg transition-all"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
            color: "#0D0A06",
          }}
        >
          Lire la dévotion
          <span className="text-sm">→</span>
        </div>
      </div>
    </Link>
  );
}
