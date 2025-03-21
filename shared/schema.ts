import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Pet schema
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // dog, cat, bird, small
  breed: text("breed").notNull(),
  age: integer("age").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull(), // Available, Adopted, Pending
  isAdoptable: boolean("is_adoptable").notNull(),
  ownerId: integer("owner_id").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerAvatarUrl: text("owner_avatar_url").notNull(),
  likes: integer("likes").default(0),
  isRecent: boolean("is_recent").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});

// Owner schema
export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull(), // Pet Foster, Pet Rescuer, Pet Owner
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOwnerSchema = createInsertSchema(owners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Report Cruelty schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  contactInfo: text("contact_info"),
  anonymous: boolean("anonymous").default(false),
  status: text("status").default("submitted"), // submitted, investigating, resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reportCrueltySchema = z.object({
  type: z.string().min(1, "Please select an incident type"),
  location: z.string().min(3, "Please provide a valid location"),
  description: z.string().min(10, "Please provide more details about the incident"),
  contactInfo: z.string().optional(),
  anonymous: z.boolean().default(false),
});

// Types
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

export type Owner = typeof owners.$inferSelect;
export type InsertOwner = z.infer<typeof insertOwnerSchema>;

export type Report = typeof reports.$inferSelect;
export type ReportCrueltySchema = z.infer<typeof reportCrueltySchema>;
