import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getOrCreateUserRecord, requireAdmin } from "./helpers";

export const getCurrentUser = query({
  handler: async (ctx) => {
    return getOrCreateUserRecord(ctx);
  },
});

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    return getOrCreateUserRecord(ctx);
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("users").collect();
  },
});

export const setUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, { targetUserId, role }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(targetUserId, { role });
  },
});