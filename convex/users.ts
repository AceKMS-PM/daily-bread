import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Get current user */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();
  },
});

/** Create or update user on sign-in */
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        imageUrl: args.imageUrl,
        lastSeen: Date.now(),
      });
      return existing._id;
    }

    // First user becomes admin
    const userCount = await ctx.db.query("users").collect();
    const role = userCount.length === 0 ? "admin" : "member";

    return ctx.db.insert("users", {
      ...args,
      role,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    });
  },
});

/** Get all users (admin only) */
export const getAllUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (user?.role !== "admin") throw new Error("Accès refusé");

    return ctx.db.query("users").collect();
  },
});

/** Promote/demote user (admin only) */
export const setUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, { targetUserId, role }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (user?.role !== "admin") throw new Error("Accès refusé");

    await ctx.db.patch(targetUserId, { role });
  },
});
