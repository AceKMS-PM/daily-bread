import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Save, ArrowLeft, Eye, Upload, Trash2, Loader2 } from "lucide-react";

const TRANSLATIONS = ["LSG", "BDS", "NEG", "KJV", "NIV", "ESV", "NBS"];
const BIBLE_BOOKS = [
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome",
  "Josué", "Juges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques",
  "Esdras", "Néhémie", "Esther", "Job", "Psaumes",
  "Proverbes", "Ecclésiaste", "Cantique des Cantiques",
  "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel",
  "Osée", "Joël", "Amos", "Abdias", "Jonas", "Michée",
  "Nahoum", "Habacuc", "Sophonie", "Aggée", "Zacharie", "Malachie",
  "Matthieu", "Marc", "Luc", "Jean", "Actes",
  "Romains", "1 Corinthiens", "2 Corinthiens", "Galates", "Éphésiens",
  "Philippiens", "Colossiens", "1 Thessaloniciens", "2 Thessaloniciens",
  "1 Timothée", "2 Timothée", "Tite", "Philémon", "Hébreux",
  "Jacques", "1 Pierre", "2 Pierre", "1 Jean", "2 Jean", "3 Jean",
  "Jude", "Apocalypse",
];

const COMMON_TAGS = [
  "foi", "espérance", "amour", "grâce", "prière", "louange",
  "repentance", "pardon", "force", "paix", "joie", "sanctification",
  "évangile", "salut", "servitude", "famille", "église"
];

type Status = "draft" | "published" | "scheduled";

export default function AdminDevotionalEditor() {
  const { id: routeId } = useParams<{ id?: string }>();
  const id = routeId as Id<"devotionals"> | undefined;
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const existingDevotional = useQuery(
    api.devotionals.getDevotionalById,
    id ? { id } : "skip"
  );

  const createDevotional = useMutation(api.devotionals.createDevotional);
  const updateDevotional = useMutation(api.devotionals.updateDevotional);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    content: "",
    scheduledFor: today,
    bibleBook: "Jean",
    bibleChapter: 1,
    bibleVerseStart: 1,
    bibleVerseEnd: undefined as number | undefined,
    bibleText: "",
    bibleTranslation: "LSG",
    prayer: "",
    reflection: "",
    coverImage: "",
    coverImageStorageId: null as Id<"_storage"> | null,
    tags: [] as string[],
    status: "draft" as Status,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "verse" | "settings">("verse");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Load existing data
  useEffect(() => {
    if (existingDevotional) {
      setForm({
        title: existingDevotional.title,
        content: existingDevotional.content,
        scheduledFor: existingDevotional.scheduledFor,
        bibleBook: existingDevotional.bibleBook,
        bibleChapter: existingDevotional.bibleChapter,
        bibleVerseStart: existingDevotional.bibleVerseStart,
        bibleVerseEnd: existingDevotional.bibleVerseEnd,
        bibleText: existingDevotional.bibleText,
        bibleTranslation: existingDevotional.bibleTranslation,
        prayer: existingDevotional.prayer ?? "",
        reflection: existingDevotional.reflection ?? "",
        coverImage: existingDevotional.coverImage ?? "",
        coverImageStorageId: existingDevotional.coverImageStorageId ?? null,
        tags: existingDevotional.tags,
        status: existingDevotional.status,
      });
    }
  }, [existingDevotional]);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload échoué");
      const { storageId } = await response.json() as { storageId: Id<"_storage"> };
      set("coverImageStorageId", storageId);
      set("coverImage", "");
      setLocalPreview(null);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    handleUpload(file);
  };

  const handleRemoveUploaded = () => {
    set("coverImageStorageId", null);
    set("coverImage", "");
    setLocalPreview(null);
  };

  const handleSave = async (statusOverride?: Status) => {
    setSaving(true);
    const payload = {
      ...form,
      status: statusOverride ?? form.status,
      ...(form.coverImageStorageId !== null && {
        coverImageStorageId: form.coverImageStorageId as Id<"_storage">,
      }),
    };
    try {
      if (isEditing && routeId) {
        await updateDevotional({ id: routeId as Id<"devotionals">, ...payload });
      } else {
        await createDevotional(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (!isEditing) navigate("/admin/devotionals");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const showImage =
    form.coverImage || form.coverImageStorageId || localPreview;

  const previewUrl = localPreview || form.coverImage || "";

  const tabStyle = (tab: string) => ({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.82rem",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
    background: activeTab === tab ? "rgba(201,168,76,0.15)" : "transparent",
    color: activeTab === tab ? "#C9A84C" : "rgba(249,241,224,0.4)",
  });

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/devotionals")}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "rgba(249,241,224,0.4)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-parchment-100">
            {isEditing ? "Modifier la dévotion" : "Nouvelle dévotion"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {form.status === "published" && (
            <a
              href={`/devotional/${form.scheduledFor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 btn-ghost"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
            >
              <Eye size={14} /> Prévisualiser
            </a>
          )}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="btn-ghost"
            style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
          >
            Sauvegarder
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-gold flex items-center gap-2"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}
          >
            <Save size={14} />
            {saving ? "..." : saved ? "✓ Sauvegardé" : "Publier"}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        placeholder="Titre de la dévotion..."
        className="w-full font-display text-3xl mb-6 bg-transparent border-0 border-b outline-none text-parchment-100"
        style={{
          borderBottomColor: "rgba(201,168,76,0.2)",
          paddingBottom: "0.75rem",
          fontSize: "1.8rem",
        }}
      />

      {/* Tabs */}
      <div
        className="flex items-center gap-1 mb-8 p-1 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.08)" }}
      >
        <button style={tabStyle("verse")} onClick={() => setActiveTab("verse")}>Verset biblique</button>
        <button style={tabStyle("content")} onClick={() => setActiveTab("content")}>Contenu</button>
        <button style={tabStyle("settings")} onClick={() => setActiveTab("settings")}>Paramètres</button>
      </div>

      {/* VERSE TAB */}
      {activeTab === "verse" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="field-label">Livre biblique</label>
              <select
                value={form.bibleBook}
                onChange={(e) => set("bibleBook", e.target.value)}
                className="field-input"
                style={{ cursor: "pointer" }}
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b} value={b} style={{ background: "#1A1308" }}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Chapitre</label>
              <input
                type="number"
                min={1}
                value={form.bibleChapter}
                onChange={(e) => set("bibleChapter", parseInt(e.target.value) || 1)}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Version</label>
              <select
                value={form.bibleTranslation}
                onChange={(e) => set("bibleTranslation", e.target.value)}
                className="field-input"
                style={{ cursor: "pointer" }}
              >
                {TRANSLATIONS.map((t) => (
                  <option key={t} value={t} style={{ background: "#1A1308" }}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Verset début</label>
              <input
                type="number"
                min={1}
                value={form.bibleVerseStart}
                onChange={(e) => set("bibleVerseStart", parseInt(e.target.value) || 1)}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Verset fin (optionnel)</label>
              <input
                type="number"
                min={1}
                value={form.bibleVerseEnd ?? ""}
                onChange={(e) => set("bibleVerseEnd", e.target.value ? parseInt(e.target.value) : undefined)}
                className="field-input"
                placeholder="—"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Texte du verset</label>
            <textarea
              value={form.bibleText}
              onChange={(e) => set("bibleText", e.target.value)}
              placeholder="Copiez le texte exact du verset ici..."
              rows={4}
              className="field-input resize-none font-serif italic"
              style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
            />
          </div>

          {/* Preview */}
          {form.bibleText && (
            <div className="verse-card">
              <p className="font-serif italic" style={{ fontSize: "1.1rem", lineHeight: 2, color: "#f9f1e0" }}>
                {form.bibleText}
              </p>
              <p className="font-sans text-xs mt-4 tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>
                — {form.bibleBook} {form.bibleChapter}:{form.bibleVerseStart} · {form.bibleTranslation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* CONTENT TAB */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div>
            <label className="field-label">Corps de la dévotion</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Écrivez ici le message principal de la dévotion..."
              rows={12}
              className="field-input resize-none font-serif"
              style={{ fontSize: "1.05rem", lineHeight: 1.9 }}
            />
          </div>

          <div>
            <label className="field-label">Réflexion (optionnel)</label>
            <textarea
              value={form.reflection}
              onChange={(e) => set("reflection", e.target.value)}
              placeholder="Une question ou pensée pour la méditation personnelle..."
              rows={4}
              className="field-input resize-none font-serif"
              style={{ lineHeight: 1.8 }}
            />
          </div>

          <div>
            <label className="field-label">Prière (optionnel)</label>
            <textarea
              value={form.prayer}
              onChange={(e) => set("prayer", e.target.value)}
              placeholder="Une prière pour conclure la dévotion..."
              rows={4}
              className="field-input resize-none font-serif italic"
              style={{ lineHeight: 1.8 }}
            />
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <label className="field-label">Date de publication</label>
            <input
              type="date"
              value={form.scheduledFor}
              onChange={(e) => set("scheduledFor", e.target.value)}
              className="field-input"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <div>
            <label className="field-label">Statut</label>
            <div className="flex gap-3">
              {(["draft", "scheduled", "published"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className="px-4 py-2 rounded-lg font-sans text-sm transition-all"
                  style={{
                    background: form.status === s ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.status === s ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: form.status === s ? "#C9A84C" : "rgba(249,241,224,0.4)",
                  }}
                >
                  {s === "draft" ? "Brouillon" : s === "scheduled" ? "Planifié" : "Publié"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Image de couverture</label>

            {/* Upload area */}
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="field-input flex items-center gap-2 w-full cursor-pointer hover:border-gold-dark/40 transition-colors"
                  style={{ borderStyle: "dashed" }}
                >
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Upload en cours...</>
                  ) : (
                    <><Upload size={16} /> Choisir une image</>
                  )}
                </button>

                <p className="font-sans text-[10px] mt-1" style={{ color: "rgba(249,241,224,0.3)" }}>
                  JPEG, PNG ou WebP
                </p>
              </div>

              {/* External URL input */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => {
                    set("coverImage", e.target.value);
                    if (e.target.value) set("coverImageStorageId", null);
                  }}
                  placeholder="Ou coller un lien externe..."
                  className="field-input font-sans text-sm"
                />
              </div>
            </div>

            {/* Preview */}
            {showImage && (
              <div className="mt-3 rounded-lg overflow-hidden border relative" style={{ borderColor: "rgba(201,168,76,0.15)", maxWidth: 400 }}>
                <img
                  src={previewUrl}
                  alt="cover preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <button
                  type="button"
                  onClick={handleRemoveUploaded}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-red-400 hover:bg-black/80 transition-colors"
                  title="Supprimer l'image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="field-label">Tags</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 rounded-full font-sans text-xs transition-all"
                  style={{
                    background: form.tags.includes(tag) ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.tags.includes(tag) ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: form.tags.includes(tag) ? "#C9A84C" : "rgba(249,241,224,0.35)",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
