import { 
  Pet, 
  Owner, 
  Report, 
  ReportCrueltySchema,
  pets as petsSchema,
  owners as ownersSchema,
  reports as reportsSchema
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Pets
  getPets(): Promise<Pet[]>;
  getPet(id: number): Promise<Pet | undefined>;
  getShowcasePets(): Promise<Pet[]>;
  createPet(pet: Omit<Pet, "id">): Promise<Pet>;
  updatePet(id: number, pet: Partial<Pet>): Promise<Pet | undefined>;
  
  // Owners
  getOwners(): Promise<Owner[]>;
  getOwner(id: number): Promise<Owner | undefined>;
  createOwner(owner: Omit<Owner, "id">): Promise<Owner>;
  
  // Reports
  createReport(report: ReportCrueltySchema): Promise<Report>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private pets: Map<number, Pet>;
  private owners: Map<number, Owner>;
  private reports: Map<number, Report>;
  
  private petId: number;
  private ownerId: number;
  private reportId: number;

  constructor() {
    this.pets = new Map();
    this.owners = new Map();
    this.reports = new Map();
    
    this.petId = 1;
    this.ownerId = 1;
    this.reportId = 1;
    
    // Initialize with sample data
    this.seedData();
  }

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
    
    const updatedPet = { ...pet, ...petUpdate };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  // Owner methods
  async getOwners(): Promise<Owner[]> {
    return Array.from(this.owners.values());
  }

  async getOwner(id: number): Promise<Owner | undefined> {
    return this.owners.get(id);
  }

  async createOwner(owner: Omit<Owner, "id">): Promise<Owner> {
    const id = this.ownerId++;
    const newOwner = { ...owner, id } as Owner;
    this.owners.set(id, newOwner);
    return newOwner;
  }

  // Report methods
  async createReport(reportData: ReportCrueltySchema): Promise<Report> {
    const id = this.reportId++;
    const now = new Date();
    
    const report: Report = {
      id,
      ...reportData,
      status: "submitted",
      createdAt: now,
      updatedAt: now
    };
    
    this.reports.set(id, report);
    return report;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const markOwner: Owner = {
      id: this.ownerId++,
      name: "Mark Wilson",
      email: "mark@example.com",
      type: "Pet Rescuer",
      bio: "Rescuing animals is my passion. I specialize in rehabilitating cats and preparing them for their new families.",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const jessicaOwner: Owner = {
      id: this.ownerId++,
      name: "Jessica Chen",
      email: "jessica@example.com",
      type: "Pet Owner",
      bio: "Animal lover with a passion for dogs. I train and care for dogs of all breeds and help them find loving homes.",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.owners.set(sarahOwner.id, sarahOwner);
    this.owners.set(markOwner.id, markOwner);
    this.owners.set(jessicaOwner.id, jessicaOwner);
    
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
  }
}

export const storage = new MemStorage();
