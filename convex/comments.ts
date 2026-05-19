import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireNotBanned } from "./helpers";

function resolveUser(user: { name?: string; imageUrl?: string } | null, isAnonymous: boolean) {
  if (isAnonymous) return { name: null, imageUrl: null };
  return user ? { name: user.name, imageUrl: user.imageUrl } : null;
}

export const getCommentsByDevotional = query({
  args: { devotionalId: v.id("devotionals") },
  handler: async (ctx, { devotionalId }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_devotional", (q) => q.eq("devotionalId", devotionalId))
      .order("desc")
      .take(100);
    return Promise.all(
      comments.map(async (c) => {
        const user = await ctx.db.get(c.userId);
        return { ...c, user: resolveUser(user, c.isAnonymous) };
      })
    );
  },
});

export const createComment = mutation({
  args: {
    devotionalId: v.id("devotionals"),
    content: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, { devotionalId, content, isAnonymous }) => {
    const user = await requireNotBanned(ctx);
    const trimmed = content.trim();
    if (trimmed.length === 0) throw new Error("Le commentaire ne peut pas être vide.");
    if (trimmed.length > 1000) throw new Error("Maximum 1000 caractères.");
    await ctx.db.insert("comments", {
      devotionalId,
      userId: user._id,
      content: trimmed,
      isAnonymous,
      createdAt: Date.now(),
    });
  },
});

export const deleteMyComment = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, { id }) => {
    const user = await requireNotBanned(ctx);
    const comment = await ctx.db.get(id);
    if (!comment) throw new Error("Commentaire introuvable.");
    if (comment.userId !== user._id) throw new Error("Tu ne peux supprimer que ton propre commentaire.");
    await ctx.db.delete(id);
  },
});
