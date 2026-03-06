import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getCurrentUserRecord(ctx: any) {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) return null;
  return ctx.db
    .query("users")
    .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
    .first();
}

export const getCurrentUser = query({
  handler: async (ctx) => getCurrentUserRecord(ctx),
});

/** Appelé après chaque connexion — complète le profil si manquant */
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;

    const authUser = await ctx.db.get(authUserId as any);
    const email = (authUser as any)?.email ?? "";
    const name = (authUser as any)?.name ?? email.split("@")[0] ?? "Membre";

    // Chercher par userId OU par email (car Auth crée d'abord sans userId)
    let existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
      .first();

    if (!existing && email) {
      existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", email))
        .first();
    }

    if (existing) {
      // Compléter les champs manquants
      const updates: any = { lastSeen: Date.now() };
      if (!existing.userId) updates.userId = authUserId;
      if (!existing.name) updates.name = name;
      if (!existing.createdAt) updates.createdAt = Date.now();
      if (!existing.role) {
        // Premier utilisateur avec un role = admin
        const withRole = (await ctx.db.query("users").collect()).filter(u => u.role);
        updates.role = withRole.length === 0 ? "admin" : "member";
      }
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    // Créer un nouveau profil complet
    const userCount = await ctx.db.query("users").collect();
    const withRole = userCount.filter(u => u.role);
    const role = withRole.length === 0 ? "admin" : "member";

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

export const getAllUsers = query({
  handler: async (ctx) => {
    const user = await getCurrentUserRecord(ctx);
    if (!user || user.role !== "admin") throw new Error("Accès refusé");
    return ctx.db.query("users").collect();
  },
});

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