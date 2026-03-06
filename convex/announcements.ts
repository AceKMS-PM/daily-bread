import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

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
    const user = await requireAdmin(ctx);
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
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});