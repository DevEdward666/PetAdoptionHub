import { z } from "zod";

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string | null;
  size: string | null;
  description: string;
  imageUrl: string;
  ownerId: number;
  ownerName: string;
  ownerAvatarUrl: string;
  likes: number | null;
  isAdoptable: boolean;
  isRecent: boolean | null;
  isFeatured: boolean | null;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  gallery?: string[];
}

export interface Owner {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  type: string;
  isApproved: boolean;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string | null;
  username: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface InsertAdmin {
  name: string;
  email: string;
  role: string;
  username: string;
  password: string;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export const insertAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "super_admin"]),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface Report {
  id: number;
  type: string;
  description: string;
  location: string;
  reporterId: number;
  createdAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  anonymous: boolean;
  contactInfo?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  stock: number;
  isAvailable: boolean;
  petType: string;
} 