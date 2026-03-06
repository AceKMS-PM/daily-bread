import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAnnouncements = query({
  handler: async (ctx) => {
    return ctx.db.query("announcements").order("desc").take(10);
  },
});

export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    expiresAt: v.optional(v.number()),
    isPinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || user.role !== "admin") throw new Error("Accès refusé");

    return ctx.db.insert("announcements", {
      ...args,
      authorId: user._id,
      createdAt: Date.now(),
    });
  },
});

export const deleteAnnouncement = mutation({
  args: { id: v.id("announcements") },
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
