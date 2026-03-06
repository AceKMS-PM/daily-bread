import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── QUERIES ────────────────────────────────────────────────────

/** Get today's devotional */
export const getTodayDevotional = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const devotional = await ctx.db
      .query("devotionals")
      .withIndex("by_status_date", (q) =>
        q.eq("status", "published").eq("scheduledFor", today)
      )
      .first();

    if (!devotional) return null;

    const author = await ctx.db.get(devotional.authorId);
    return { ...devotional, author };
  },
});

/** Get devotional by date */
export const getDevotionalByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const devotional = await ctx.db
      .query("devotionals")
      .withIndex("by_status_date", (q) =>
        q.eq("status", "published").eq("scheduledFor", date)
      )
      .first();

    if (!devotional) return null;
    const author = await ctx.db.get(devotional.authorId);
    return { ...devotional, author };
  },
});

/** Get recent published devotionals */
export const getRecentDevotionals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    const devotionals = await ctx.db
      .query("devotionals")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);

    return Promise.all(
      devotionals.map(async (d) => {
        const author = await ctx.db.get(d.authorId);
        return { ...d, author };
      })
    );
  },
});

/** Get all devotionals (admin) */
export const getAllDevotionals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (user?.role !== "admin") throw new Error("Accès refusé");

    const devotionals = await ctx.db.query("devotionals").order("desc").collect();

    return Promise.all(
      devotionals.map(async (d) => {
        const author = await ctx.db.get(d.authorId);
        return { ...d, author };
      })
    );
  },
});

/** Get devotional by ID */
export const getDevotionalById = query({
  args: { id: v.id("devotionals") },
  handler: async (ctx, { id }) => {
    const devotional = await ctx.db.get(id);
    if (!devotional) return null;
    const author = await ctx.db.get(devotional.authorId);
    return { ...devotional, author };
  },
});

/** Get user reactions for a devotional */
export const getUserReactions = query({
  args: { devotionalId: v.id("devotionals") },
  handler: async (ctx, { devotionalId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    return ctx.db
      .query("reactions")
      .withIndex("by_user_devotional", (q) =>
        q.eq("userId", user._id).eq("devotionalId", devotionalId)
      )
      .collect();
  },
});

// ── MUTATIONS ─────────────────────────────────────────────────

/** Create a new devotional (admin only) */
export const createDevotional = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    scheduledFor: v.string(),
    bibleBook: v.string(),
    bibleChapter: v.number(),
    bibleVerseStart: v.number(),
    bibleVerseEnd: v.optional(v.number()),
    bibleText: v.string(),
    bibleTranslation: v.string(),
    prayer: v.optional(v.string()),
    reflection: v.optional(v.string()),
    tags: v.array(v.string()),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || user.role !== "admin") throw new Error("Accès refusé");

    const id = await ctx.db.insert("devotionals", {
      ...args,
      authorId: user._id,
      publishedAt: args.status === "published" ? Date.now() : undefined,
      viewCount: 0,
      likeCount: 0,
    });

    return id;
  },
});

/** Update a devotional (admin only) */
export const updateDevotional = mutation({
  args: {
    id: v.id("devotionals"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    scheduledFor: v.optional(v.string()),
    bibleBook: v.optional(v.string()),
    bibleChapter: v.optional(v.number()),
    bibleVerseStart: v.optional(v.number()),
    bibleVerseEnd: v.optional(v.number()),
    bibleText: v.optional(v.string()),
    bibleTranslation: v.optional(v.string()),
    prayer: v.optional(v.string()),
    reflection: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    coverImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || user.role !== "admin") throw new Error("Accès refusé");

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    if (updates.status === "published") {
      (cleanUpdates as Record<string, unknown>).publishedAt = Date.now();
    }

    await ctx.db.patch(id, cleanUpdates);
  },
});

/** Delete a devotional (admin only) */
export const deleteDevotional = mutation({
  args: { id: v.id("devotionals") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || user.role !== "admin") throw new Error("Accès refusé");

    await ctx.db.delete(id);
  },
});

/** Toggle reaction */
export const toggleReaction = mutation({
  args: {
    devotionalId: v.id("devotionals"),
    type: v.union(v.literal("amen"), v.literal("heart"), v.literal("fire"), v.literal("pray")),
  },
  handler: async (ctx, { devotionalId, type }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("Utilisateur non trouvé");

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_user_devotional", (q) =>
        q.eq("userId", user._id).eq("devotionalId", devotionalId)
      )
      .filter((q) => q.eq(q.field("type"), type))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("reactions", {
        userId: user._id,
        devotionalId,
        type,
        createdAt: Date.now(),
      });
    }
  },
});

/** Increment view count */
export const incrementViewCount = mutation({
  args: { id: v.id("devotionals") },
  handler: async (ctx, { id }) => {
    const devotional = await ctx.db.get(id);
    if (!devotional) return;
    await ctx.db.patch(id, { viewCount: devotional.viewCount + 1 });
  },
});
