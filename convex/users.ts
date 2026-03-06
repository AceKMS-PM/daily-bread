import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Helper — get our users record from auth session */
async function getCurrentUserRecord(ctx: any) {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) return null;
  return ctx.db
    .query("users")
    .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
    .first();
}

/** Get current user */
export const getCurrentUser = query({
  handler: async (ctx) => {
    return getCurrentUserRecord(ctx);
  },
});

/** Public mutation — create/update user profile after sign-in */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastSeen: Date.now() });
      return existing._id;
    }

    const authUser = await ctx.db.get(authUserId);
    const email = (authUser as any)?.email ?? "";
    const name = (authUser as any)?.name ?? email.split("@")[0] ?? "Membre";

    const userCount = await ctx.db.query("users").collect();
    const role = userCount.length === 0 ? "admin" : "member";

    return ctx.db.insert("users", {
      userId: authUserId,
      email,
      name,
      role,
      createdAt: Date.now(),
      lastSeen: Date.now(),
    });
  },
});

/** Get all users (admin only) */
export const getAllUsers = query({
  handler: async (ctx) => {
    const user = await getCurrentUserRecord(ctx);
    if (!user || user.role !== "admin") throw new Error("Accès refusé");
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
    const user = await getCurrentUserRecord(ctx);
    if (!user || user.role !== "admin") throw new Error("Accès refusé");
    await ctx.db.patch(targetUserId, { role });
  },
});