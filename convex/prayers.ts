import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getCurrentUserRecord(ctx: any) {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) return null;
  return ctx.db
    .query("users")
    .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
    .first();
}

export const getPublicPrayerRequests = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const prayers = await ctx.db
      .query("prayerRequests")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(limit);
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
    const user = await getCurrentUserRecord(ctx);
    if (!user) throw new Error("Non authentifié");
    return ctx.db.insert("prayerRequests", {
      ...args,
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
    const prayer = await ctx.db.get(id);
    if (!prayer) return;
    await ctx.db.patch(id, { prayerCount: prayer.prayerCount + 1 });
  },
});