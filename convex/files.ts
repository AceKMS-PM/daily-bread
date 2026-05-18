import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./helpers";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

export const deleteStorageFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireAdmin(ctx);
    await ctx.storage.delete(storageId);
  },
});
