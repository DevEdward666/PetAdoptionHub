import { 
  Pet, 
  Owner, 
  Report, 
  ReportCrueltySchema,
  Admin,
  InsertAdmin,
  AdminLogin,
  Product,
  InsertProduct,
  pets as petsSchema,
  owners as ownersSchema,
  reports as reportsSchema,
  admins as adminsSchema,
  products as productsSchema,
  UserLogin,
  InsertOwner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // Pets
  getPets(): Promise<Pet[]>;
  getPet(id: number): Promise<Pet | undefined>;
  getShowcasePets(): Promise<Pet[]>;
  createPet(pet: Omit<Pet, "id">): Promise<Pet>;
  updatePet(id: number, pet: Partial<Pet>): Promise<Pet | undefined>;
  deletePet(id: number): Promise<boolean>;
  
  // Owners
  getOwners(): Promise<Owner[]>;
  getPendingOwners(): Promise<Owner[]>;
  getOwner(id: number): Promise<Owner | undefined>;
  // createOwner(owner: Omit<Owner, "id">): Promise<Owner>;
  registerOwner(owner: Omit<Owner, "id">): Promise<Owner>;
  updateOwner(id: number, owner: Partial<Owner>): Promise<Owner | undefined>;
  approveOwner(id: number): Promise<Owner | undefined>;
  deleteOwner(id: number): Promise<boolean>;
  
  // Reports
  getReports(): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: ReportCrueltySchema): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  
  // Admins
  getAdmins(): Promise<Admin[]>;
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  validateAdminLogin(credentials: AdminLogin): Promise<Admin | null>;
  validateUserLogin(credentials: UserLogin): Promise<Owner | null>;
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private pets: Map<number, Pet>;
  private owners: Map<number, Owner>;
  private reports: Map<number, Report>;
  private admins: Map<number, Admin>;
  private products: Map<number, Product>;
  
  private petId: number;
  private ownerId: number;
  private reportId: number;
  private adminId: number;
  private productId: number;

  constructor() {
    this.pets = new Map();
    this.owners = new Map();
    this.reports = new Map();
    this.admins = new Map();
    this.products = new Map();
    
    this.petId = 1;
    this.ownerId = 1;
    this.reportId = 1;
    this.adminId = 1;
    this.productId = 1;
    
    // Initialize with sample data
    this.seedData();
  }
  // createOwner(owner: Omit<Owner, "id">): Promise<Owner> {
  //   const id = this.ownerId++;
  //   const newOwner = { 
  //     ...owner, 
  //     id,
  //     isApproved: false,
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   } as Owner;
  //   this.owners.set(id, newOwner);
  //   return newOwner;
  // }

  // Pet methods
  async getPets(): Promise<Pet[]> {
    // Return only adoptable pets
    return Array.from(this.pets.values()).filter(pet => pet.isAdoptable);
  }

  async getPet(id: number): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getShowcasePets(): Promise<Pet[]> {
    // Return only non-adoptable (showcase) pets
    return Array.from(this.pets.values()).filter(pet => !pet.isAdoptable);
  }

  async createPet(pet: Omit<Pet, "id">): Promise<Pet> {
    const id = this.petId++;
    const newPet = { ...pet, id } as Pet;
    this.pets.set(id, newPet);
    return newPet;
  }

  async updatePet(id: number, petUpdate: Partial<Pet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet = { ...pet, ...petUpdate, updatedAt: new Date() };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }
  
  async deletePet(id: number): Promise<boolean> {
    if (!this.pets.has(id)) return false;
    return this.pets.delete(id);
  }

  // Owner methods
  async getOwners(): Promise<Owner[]> {
    return Array.from(this.owners.values());
  }
  
  async getPendingOwners(): Promise<Owner[]> {
    return Array.from(this.owners.values()).filter(owner => !owner.isApproved);
  }

  async getOwner(id: number): Promise<Owner | undefined> {
    return this.owners.get(id);
  }

  async registerOwner(owner:Omit<Owner, "id">): Promise<Owner> {
    const id = this.ownerId++;
    const newOwner = { 
      ...owner, 
      id,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Owner;
    this.owners.set(id, newOwner);
    return newOwner;
  }
  
  async updateOwner(id: number, ownerUpdate: Partial<Owner>): Promise<Owner | undefined> {
    const owner = this.owners.get(id);
    if (!owner) return undefined;
    
    const updatedOwner = { ...owner, ...ownerUpdate, updatedAt: new Date() };
    this.owners.set(id, updatedOwner);
    return updatedOwner;
  }
  
  async approveOwner(id: number): Promise<Owner | undefined> {
    const owner = this.owners.get(id);
    if (!owner) return undefined;
    
    const approvedOwner = { ...owner, isApproved: true, updatedAt: new Date() };
    this.owners.set(id, approvedOwner);
    return approvedOwner;
  }
  
  async deleteOwner(id: number): Promise<boolean> {
    if (!this.owners.has(id)) return false;
    return this.owners.delete(id);
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }
  
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async createReport(reportData: ReportCrueltySchema): Promise<Report> {
    const id = this.reportId++;
    const now = new Date();
    
    const report: Report = {
      id,
      ...reportData,
      contactInfo: reportData.contactInfo ?? null,
      status: "submitted",
      adminNotes: null,
      assignedTo: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.reports.set(id, report);
    return report;
  }
  
  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...reportUpdate, updatedAt: new Date() };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }
  
  // Admin methods
  async getAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }
  
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }
  
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.username === username);
  }
  async getUserByEmail(email: string): Promise<Owner | undefined> {
    return Array.from(this.owners.values()).find(owner => owner.email === email);
  }
  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const id = this.adminId++;
    const now = new Date();
    
    const admin: Admin = {
      id,
      ...adminData,
      role: adminData.role ?? null,
      createdAt: now,
      updatedAt: now
    };
    
    this.admins.set(id, admin);
    return admin;
  }
  
  async validateAdminLogin(credentials: AdminLogin): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(credentials.username);
    if (!admin) return null;
    
    // In production, use proper password hashing and validation
    if (admin.password === credentials.password) {
      return admin;
    }
    return null;
  }
  async validateUserLogin(credentials: UserLogin): Promise<Owner | null> {
    const user = await this.getUserByEmail(credentials.email);
    if (!user) return null;
    
    // In production, use proper password hashing and validation
    if (user.password === credentials.password) {
      return user;
    }
    return null;
  }
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    
    const product: Product = {
      id,
      ...productData,
      stock: productData.stock ?? null,
      isAvailable: productData.isAvailable ?? null,
      createdAt: now,
      updatedAt: now
    };
    
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    if (!this.products.has(id)) return false;
    return this.products.delete(id);
  }

  // Seed with sample data
  private seedData() {
    // Create owners
    const sarahOwner: Owner = {
      id: this.ownerId++,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      type: "Pet Foster",
      bio: "I love fostering pets and helping them find their forever homes. Currently have 2 dogs and 1 cat available for adoption.",
      avatarUrl: "https://randomuser.me/api/portraits/women/62.jpg",
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
            password: ""
    };
    
    const markOwner: Owner = {
      id: this.ownerId++,
      name: "Mark Wilson",
      email: "mark@example.com",
      type: "Pet Rescuer",
      bio: "Rescuing animals is my passion. I specialize in rehabilitating cats and preparing them for their new families.",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: ""
    };
    
    const jessicaOwner: Owner = {
      id: this.ownerId++,
      name: "Jessica Chen",
      email: "jessica@example.com",
      type: "Pet Owner",
      bio: "Animal lover with a passion for dogs. I train and care for dogs of all breeds and help them find loving homes.",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
            password: ""
    };
    
    // Add a pending owner for testing
    const michaelOwner: Owner = {
      id: this.ownerId++,
      name: "Michael Brown",
      email: "michael@example.com",
      type: "Pet Owner",
      bio: "New to pet adoption, looking to add a furry friend to my family. Interested in small dogs.",
      avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
            password: ""
    };
    
    this.owners.set(sarahOwner.id, sarahOwner);
    this.owners.set(markOwner.id, markOwner);
    this.owners.set(jessicaOwner.id, jessicaOwner);
    this.owners.set(michaelOwner.id, michaelOwner);
    
    // Create adoptable pets
    const maxPet: Pet = {
      id: this.petId++,
      name: "Max",
      type: "dog",
      breed: "Golden Retriever",
      age: 2,
      description: "Friendly and energetic companion looking for an active family.",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      status: "Available",
      isAdoptable: true,
      ownerId: sarahOwner.id,
      ownerName: sarahOwner.name,
      ownerAvatarUrl: sarahOwner.avatarUrl,
      likes: 120,
      isRecent: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const lunaPet: Pet = {
      id: this.petId++,
      name: "Luna",
      type: "cat",
      breed: "Domestic Shorthair",
      age: 1,
      description: "Playful and affectionate, loves to curl up on laps.",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      status: "Available",
      isAdoptable: true,
      ownerId: markOwner.id,
      ownerName: markOwner.name,
      ownerAvatarUrl: markOwner.avatarUrl,
      likes: 87,
      isRecent: false,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const buddyPet: Pet = {
      id: this.petId++,
      name: "Buddy",
      type: "dog",
      breed: "Border Collie",
      age: 3,
      description: "Intelligent and loyal, great with children and other pets.",
      imageUrl: "https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      status: "Available",
      isAdoptable: true,
      ownerId: jessicaOwner.id,
      ownerName: jessicaOwner.name,
      ownerAvatarUrl: jessicaOwner.avatarUrl,
      likes: 145,
      isRecent: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Create showcase pets
    const charliePet: Pet = {
      id: this.petId++,
      name: "Charlie",
      type: "dog",
      breed: "Pug",
      age: 4,
      description: "Adorable and cuddly pug with tons of personality.",
      imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: sarahOwner.id,
      ownerName: "Emma",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
      likes: 243,
      isRecent: false,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const bellaPet: Pet = {
      id: this.petId++,
      name: "Bella",
      type: "dog",
      breed: "Labrador",
      age: 2,
      description: "Beautiful and gentle lab that loves to play fetch.",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: markOwner.id,
      ownerName: "James",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      likes: 187,
      isRecent: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const rioPet: Pet = {
      id: this.petId++,
      name: "Rio",
      type: "bird",
      breed: "Parrot",
      age: 5,
      description: "Colorful parrot that can say over 50 words!",
      imageUrl: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: jessicaOwner.id,
      ownerName: "Linda",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      likes: 156,
      isRecent: false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const whiskersPet: Pet = {
      id: this.petId++,
      name: "Whiskers",
      type: "cat",
      breed: "Maine Coon",
      age: 3,
      description: "Majestic Maine Coon with a stunning coat and friendly personality.",
      imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: markOwner.id,
      ownerName: "Michael",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      likes: 219,
      isRecent: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const oreoPet: Pet = {
      id: this.petId++,
      name: "Oreo",
      type: "small",
      breed: "Guinea Pig",
      age: 1,
      description: "Cute guinea pig with black and white markings like an Oreo cookie.",
      imageUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: sarahOwner.id,
      ownerName: "Sophie",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
      likes: 142,
      isRecent: false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const thumperPet: Pet = {
      id: this.petId++,
      name: "Thumper",
      type: "small",
      breed: "Rabbit",
      age: 1,
      description: "Energetic rabbit who loves to hop around and eat carrots.",
      imageUrl: "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      status: "Not for adoption",
      isAdoptable: false,
      ownerId: jessicaOwner.id,
      ownerName: "David",
      ownerAvatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      likes: 98,
      isRecent: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.pets.set(maxPet.id, maxPet);
    this.pets.set(lunaPet.id, lunaPet);
    this.pets.set(buddyPet.id, buddyPet);
    this.pets.set(charliePet.id, charliePet);
    this.pets.set(bellaPet.id, bellaPet);
    this.pets.set(rioPet.id, rioPet);
    this.pets.set(whiskersPet.id, whiskersPet);
    this.pets.set(oreoPet.id, oreoPet);
    this.pets.set(thumperPet.id, thumperPet);
    
    // Create sample reports
    const report1: Report = {
      id: this.reportId++,
      type: "Neglect",
      location: "123 Main St, Anytown",
      description: "Dog left outside in extreme heat without water or shelter.",
      contactInfo: "john@example.com",
      anonymous: false,
      status: "submitted",
      adminNotes: null,
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const report2: Report = {
      id: this.reportId++,
      type: "Abuse",
      location: "456 Park Ave, Cityville",
      description: "Multiple cats in poor condition, appear to be malnourished.",
      contactInfo: null,
      anonymous: true,
      status: "investigating",
      adminNotes: "Assigned to animal control for investigation.",
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.reports.set(report1.id, report1);
    this.reports.set(report2.id, report2);
    
    // Create admin user
    const admin: Admin = {
      id: this.adminId++,
      username: "admin",
      password: "password123", // In production, use hashed passwords
      name: "Admin User",
      email: "admin@petshop.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.admins.set(admin.id, admin);
    
    // Create sample products
    const product1: Product = {
      id: this.productId++,
      name: "Premium Dog Food",
      description: "High-quality dog food with balanced nutrition for adult dogs.",
      category: "food",
      petType: "dog",
      price: "29.99",
      imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      stock: 50,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const product2: Product = {
      id: this.productId++,
      name: "Interactive Cat Toy",
      description: "Automatic laser toy to keep your cat entertained for hours.",
      category: "toys",
      petType: "cat",
      price: "19.99",
      imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      stock: 30,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const product3: Product = {
      id: this.productId++,
      name: "Pet Carrier",
      description: "Comfortable and secure carrier for small to medium pets.",
      category: "accessories",
      petType: "small",
      price: "34.99",
      imageUrl: "https://images.unsplash.com/photo-1597843797221-e34b4ff3b3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
      stock: 15,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.products.set(product1.id, product1);
    this.products.set(product2.id, product2);
    this.products.set(product3.id, product3);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Pets methods
  async getPets(): Promise<Pet[]> {
    return db.select().from(petsSchema).where(eq(petsSchema.isAdoptable, true));
  }

  async getPet(id: number): Promise<Pet | undefined> {
    const [pet] = await db.select().from(petsSchema).where(eq(petsSchema.id, id));
    return pet;
  }

  async getShowcasePets(): Promise<Pet[]> {
    return db.select().from(petsSchema).where(eq(petsSchema.isAdoptable, false));
  }

  async createPet(pet: Omit<Pet, "id">): Promise<Pet> {
    const [newPet] = await db.insert(petsSchema).values(pet).returning();
    return newPet;
  }

  async updatePet(id: number, petUpdate: Partial<Pet>): Promise<Pet | undefined> {
    const [updatedPet] = await db
      .update(petsSchema)
      .set({ ...petUpdate, updatedAt: new Date() })
      .where(eq(petsSchema.id, id))
      .returning();
    return updatedPet;
  }

  async deletePet(id: number): Promise<boolean> {
    const [deletedPet] = await db
      .delete(petsSchema)
      .where(eq(petsSchema.id, id))
      .returning();
    return !!deletedPet;
  }

  // Owners methods
  async getOwners(): Promise<Owner[]> {
    return db.select().from(ownersSchema);
  }

  async getPendingOwners(): Promise<Owner[]> {
    return db.select().from(ownersSchema).where(eq(ownersSchema.isApproved, false));
  }

  async getOwner(id: number): Promise<Owner | undefined> {
    const [owner] = await db.select().from(ownersSchema).where(eq(ownersSchema.id, id));
    return owner;
  }

  async registerOwner(owner: Omit<Owner, "id">): Promise<Owner> {
    const ownerWithDefaults = {
      ...owner,
      isApproved: false
    };
    const [newOwner] = await db.insert(ownersSchema).values(ownerWithDefaults).returning();
    return newOwner;
  }

  async updateOwner(id: number, ownerUpdate: Partial<Owner>): Promise<Owner | undefined> {
    const [updatedOwner] = await db
      .update(ownersSchema)
      .set({ ...ownerUpdate, updatedAt: new Date() })
      .where(eq(ownersSchema.id, id))
      .returning();
    return updatedOwner;
  }

  async approveOwner(id: number): Promise<Owner | undefined> {
    const [approvedOwner] = await db
      .update(ownersSchema)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(ownersSchema.id, id))
      .returning();
    return approvedOwner;
  }

  async deleteOwner(id: number): Promise<boolean> {
    const [deletedOwner] = await db
      .delete(ownersSchema)
      .where(eq(ownersSchema.id, id))
      .returning();
    return !!deletedOwner;
  }

  // Reports methods
  async getReports(): Promise<Report[]> {
    return db.select().from(reportsSchema);
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reportsSchema).where(eq(reportsSchema.id, id));
    return report;
  }

  async createReport(reportData: ReportCrueltySchema): Promise<Report> {
    const reportToInsert = {
      ...reportData,
      contactInfo: reportData.contactInfo ?? null,
      status: "submitted",
      adminNotes: null,
      assignedTo: null
    };
    const [newReport] = await db.insert(reportsSchema).values(reportToInsert).returning();
    return newReport;
  }

  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    const [updatedReport] = await db
      .update(reportsSchema)
      .set({ ...reportUpdate, updatedAt: new Date() })
      .where(eq(reportsSchema.id, id))
      .returning();
    return updatedReport;
  }

  // Admin methods
  async getAdmins(): Promise<Admin[]> {
    return db.select().from(adminsSchema);
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(adminsSchema).where(eq(adminsSchema.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(adminsSchema).where(eq(adminsSchema.username, username));
    return admin;
  }
  async getUserByEmail(email: string): Promise<Owner | undefined> {
    const [user] = await db.select().from(ownersSchema).where(eq(ownersSchema.email, email));
    return user;
  }
  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const adminToInsert = {
      ...adminData,
      role: adminData.role ?? null
    };
    const [newAdmin] = await db.insert(adminsSchema).values(adminToInsert).returning();
    return newAdmin;
  }

  async validateAdminLogin(credentials: AdminLogin): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(credentials.username);
    if (!admin) return null;
    
    // In production, use proper password hashing and validation
    if (admin.password === credentials.password) {
      return admin;
    }
    return null;
  }
  async validateUserLogin(credentials: UserLogin): Promise<Owner | null> {
    const user = await this.getUserByEmail(credentials.email);
    if (!user) return null;
    
    // In production, use proper password hashing and validation
    if (user.password === credentials.password) {
      return user;
    }
    return null;
  }
  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.select().from(productsSchema);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(productsSchema).where(eq(productsSchema.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(productsSchema).values(productData).returning();
    return newProduct;
  }

  async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(productsSchema)
      .set({ ...productUpdate, updatedAt: new Date() })
      .where(eq(productsSchema.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [deletedProduct] = await db
      .delete(productsSchema)
      .where(eq(productsSchema.id, id))
      .returning();
    return !!deletedProduct;
  }
}

// Switch to the database implementation
export const storage = new DatabaseStorage();
