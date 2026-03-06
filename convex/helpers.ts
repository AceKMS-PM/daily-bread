import { getAuthUserId } from "@convex-dev/auth/server";

export async function getOrCreateUserRecord(ctx: any) {
  const authUserId = await getAuthUserId(ctx);
  if (!authUserId) return null;

  let user = await ctx.db
    .query("users")
    .withIndex("by_user_id", (q: any) => q.eq("userId", authUserId))
    .first();

  if (user?.role) return user;

  const authUser = await ctx.db.get(authUserId as any);
  const email = (authUser as any)?.email ?? "";
  const name = (authUser as any)?.name ?? email.split("@")[0] ?? "Membre";

  if (!user && email) {
    user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", email))
      .first();
  }

  if (user) {
    const updates: any = { lastSeen: Date.now() };
    if (!user.userId) updates.userId = authUserId;
    if (!user.name) updates.name = name;
    if (!user.createdAt) updates.createdAt = Date.now();
    if (!user.role) {
      const withRole = (await ctx.db.query("users").collect()).filter((u: any) => u.role);
      updates.role = withRole.length === 0 ? "admin" : "member";
    }
    await ctx.db.patch(user._id, updates);
    return { ...user, ...updates };
  }

  const allUsers = await ctx.db.query("users").collect();
  const withRole = allUsers.filter((u: any) => u.role);
  const role = withRole.length === 0 ? "admin" : "member";

  const id = await ctx.db.insert("users", {
    userId: authUserId,
    email,
    name,
    role,
    createdAt: Date.now(),
    lastSeen: Date.now(),
  });

  return ctx.db.get(id);
}

export async function requireAdmin(ctx: any) {
  const user = await getOrCreateUserRecord(ctx);
  if (!user || user.role !== "admin") throw new Error("Accès refusé");
  return user;
}

export async function requireAuth(ctx: any) {
  const user = await getOrCreateUserRecord(ctx);
  if (!user) throw new Error("Vous devez être connecté.");
  return user;
}