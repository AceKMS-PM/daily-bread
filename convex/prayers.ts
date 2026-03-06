import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getOrCreateUserRecord, requireAuth } from "./helpers";

export const getPublicPrayerRequests = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const prayers = await ctx.db
      .query("prayerRequests")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(safeLimit);
    return Promise.all(
      prayers.map(async (p) => {
        const user = await ctx.db.get(p.userId);
        return { ...p, user };
      })
    );
  },
});

export const createPrayerRequest = mutation({
  args: {
    content: v.string(),
    devotionalId: v.optional(v.id("devotionals")),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    if (args.content.trim().length === 0) throw new Error("Le contenu ne peut pas être vide.");
    if (args.content.length > 1000) throw new Error("La prière ne peut pas dépasser 1000 caractères.");

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentPrayers = await ctx.db
      .query("prayerRequests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), oneHourAgo))
      .collect();
    if (recentPrayers.length >= 5) throw new Error("Trop de prières soumises. Réessayez dans une heure.");

    return ctx.db.insert("prayerRequests", {
      ...args,
      content: args.content.trim(),
      userId: user._id,
      isPrayed: false,
      prayerCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const prayForRequest = mutation({
  args: { id: v.id("prayerRequests") },
  handler: async (ctx, { id }) => {
    const user = await requireAuth(ctx);
    const prayer = await ctx.db.get(id);
    if (!prayer) return;
    if (prayer.userId === user._id) throw new Error("Vous ne pouvez pas prier pour votre propre demande.");
    await ctx.db.patch(id, { prayerCount: prayer.prayerCount + 1 });
  },
});