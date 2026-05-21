import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("publish-scheduled", { hours: 1 }, internal.crons.publishScheduled, {});
export default crons;

export const publishScheduled = internalMutation({
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const scheduled = await ctx.db
      .query("devotionals")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect();
    for (const d of scheduled) {
      if (d.scheduledFor <= today) {
        await ctx.db.patch(d._id, {
          status: "published",
          publishedAt: Date.now(),
        });
      }
    }
  },
});
