import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    createdAt: v.number(),
    lastSeen: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Daily devotionals
  devotionals: defineTable({
    title: v.string(),
    content: v.string(), // Rich text / markdown
    authorId: v.id("users"),
    publishedAt: v.optional(v.number()), // null = draft
    scheduledFor: v.string(), // "YYYY-MM-DD" date string
    bibleBook: v.string(),
    bibleChapter: v.number(),
    bibleVerseStart: v.number(),
    bibleVerseEnd: v.optional(v.number()),
    bibleText: v.string(), // The actual verse text
    bibleTranslation: v.string(), // "LSG", "BDS", "KJV", "NIV"...
    prayer: v.optional(v.string()),
    reflection: v.optional(v.string()),
    tags: v.array(v.string()),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("scheduled")),
    viewCount: v.number(),
    likeCount: v.number(),
  })
    .index("by_date", ["scheduledFor"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_status_date", ["status", "scheduledFor"]),

  // Bible verses of the day (standalone, can be linked to devotional)
  verseOfDay: defineTable({
    date: v.string(), // "YYYY-MM-DD"
    book: v.string(),
    chapter: v.number(),
    verseStart: v.number(),
    verseEnd: v.optional(v.number()),
    text: v.string(),
    translation: v.string(),
    devotionalId: v.optional(v.id("devotionals")),
    authorId: v.id("users"),
    publishedAt: v.optional(v.number()),
  })
    .index("by_date", ["date"])
    .index("by_devotional", ["devotionalId"]),

  // Community reactions / likes
  reactions: defineTable({
    userId: v.id("users"),
    devotionalId: v.id("devotionals"),
    type: v.union(v.literal("amen"), v.literal("heart"), v.literal("fire"), v.literal("pray")),
    createdAt: v.number(),
  })
    .index("by_devotional", ["devotionalId"])
    .index("by_user_devotional", ["userId", "devotionalId"]),

  // Comments / Prayer requests
  prayerRequests: defineTable({
    userId: v.id("users"),
    devotionalId: v.optional(v.id("devotionals")),
    content: v.string(),
    isPublic: v.boolean(),
    isPrayed: v.boolean(),
    prayerCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_devotional", ["devotionalId"])
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("new_devotional"),
      v.literal("new_verse"),
      v.literal("prayer_answered"),
      v.literal("announcement")
    ),
    isRead: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"]),

  // Announcements
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    isPinned: v.boolean(),
  }).index("by_pinned", ["isPinned"]),
});