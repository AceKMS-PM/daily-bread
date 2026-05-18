import { Share2, Twitter, Facebook, MessageCircle, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = `${title}${description ? ` — ${description}` : ""}`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "#1DA1F2",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877F2",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "#25D366",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
      } catch {}
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "rgba(249,241,224,0.3)" }}>
        Partager
      </span>

      {"share" in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-colors"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
            color: "#C9A84C",
          }}
        >
          <Share2 size={14} />
          Partager
        </button>
      )}

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-colors hover:bg-white/5"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: link.color }}
        >
          <link.icon size={14} />
          {link.name}
        </a>
      ))}

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-colors hover:bg-white/5"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          color: copied ? "#4ADE80" : "rgba(249,241,224,0.4)",
        }}
      >
        <LinkIcon size={14} />
        {copied ? "Copié !" : "Lien"}
      </button>
    </div>
  );
}
