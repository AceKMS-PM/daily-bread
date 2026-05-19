import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireNotBanned } from "./helpers";

function resolveUser(user: { name?: string; imageUrl?: string } | null, isAnonymous: boolean) {
  if (isAnonymous) return { name: null, imageUrl: null };
  return user ? { name: user.name, imageUrl: user.imageUrl } : null;
}

export const getApprovedTestimonials = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .order("desc")
      .take(Math.min(limit, 50));
    return Promise.all(
      testimonials.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return { ...t, user: resolveUser(user, t.isAnonymous ?? false) };
      })
    );
  },
});

export const getAllTestimonials = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const testimonials = await ctx.db.query("testimonials").order("desc").take(200);
    return Promise.all(
      testimonials.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return { ...t, user: resolveUser(user, t.isAnonymous ?? false) };
      })
    );
  },
});

export const createTestimonial = mutation({
  args: { content: v.string(), isAnonymous: v.boolean() },
  handler: async (ctx, { content, isAnonymous }) => {
    const user = await requireNotBanned(ctx);
    if (!user) throw new Error("Connecte-toi pour laisser un témoignage.");
    const trimmed = content.trim();
    if (trimmed.length > 1000) throw new Error("Maximum 1000 caractères.");

    await ctx.db.insert("testimonials", {
      userId: user._id,
      content: trimmed,
      isApproved: false,
      isAnonymous,
      createdAt: Date.now(),
    });
  },
});

export const deleteMyTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    const user = await requireNotBanned(ctx);
    const testimonial = await ctx.db.get(id);
    if (!testimonial) throw new Error("Témoignage introuvable.");
    if (testimonial.userId !== user._id) throw new Error("Tu ne peux supprimer que ton propre témoignage.");
    await ctx.db.delete(id);
  },
});

export const approveTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { isApproved: true });
  },
});

export const rejectTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
