import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
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
  password: text("password").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOwnerSchema = createInsertSchema(owners).omit({
  id: true,
  isApproved: true,
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
  adminNotes: text("admin_notes"),
  assignedTo: integer("assigned_to"),
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

// Admin schema
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").default("admin"), // admin, super_admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertUserchema = createInsertSchema(owners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
// Pet Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // food, toys, accessories, health
  petType: text("pet_type").notNull(), // dog, cat, bird, small
  price: decimal("price").notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").default(0),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

export type Owner = typeof owners.$inferSelect;
export type InsertOwner = z.infer<typeof insertUserchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;

export type Report = typeof reports.$inferSelect;
export type ReportCrueltySchema = z.infer<typeof reportCrueltySchema>;

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
