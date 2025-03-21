import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  reportCrueltySchema, 
  adminLoginSchema, 
  insertAdminSchema,
  insertPetSchema,
  insertOwnerSchema,
  insertProductSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Admin authentication middleware
const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }
  
  try {
    // In a real application, you would verify a JWT token or session
    // For this example, we're using a simple admin username check
    const adminUsername = Buffer.from(token, 'base64').toString();
    const admin = await storage.getAdminByUsername(adminUsername);
    
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    
    // Add admin to request object for use in route handlers
    (req as any).admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // --------------------------------
  // Public API Routes
  // --------------------------------
  
  // API routes for pets
  // API routes for showcase pets (non-adoptable) - Specific route first
  app.get("/api/pets/showcase", async (req, res) => {
    try {
      const pets = await storage.getShowcasePets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch showcase pets" });
    }
  });
  
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = await storage.getPets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  app.get("/api/pets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pet = await storage.getPet(id);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.json(pet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pet" });
    }
  });

  // API routes for owners
  app.get("/api/owners", async (req, res) => {
    try {
      const owners = await storage.getOwners();
      res.json(owners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch owners" });
    }
  });

  app.get("/api/owners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const owner = await storage.getOwner(id);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.json(owner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch owner" });
    }
  });

  // API routes for cruelty reports
  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = reportCrueltySchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });
  
  // API routes for products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // --------------------------------
  // Admin API Routes
  // --------------------------------
  
  // Admin Login API route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const credentials = adminLoginSchema.parse(req.body);
      const admin = await storage.validateAdminLogin(credentials);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, use proper JWT token generation
      // For this example, we'll use a Base64 encoded username as token
      const token = Buffer.from(admin.username).toString('base64');
      
      res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Admin Dashboard Data API route
  app.get("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    try {
      const pets = await storage.getPets();
      const owners = await storage.getOwners();
      const pendingOwners = await storage.getPendingOwners();
      const reports = await storage.getReports();
      const products = await storage.getProducts();
      
      res.json({
        counts: {
          pets: pets.length,
          owners: owners.length,
          pendingOwners: pendingOwners.length,
          reports: reports.length,
          products: products.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  
  // Admin Pets Management API routes
  app.get("/api/admin/pets", authenticateAdmin, async (req, res) => {
    try {
      // Get all pets (both adoptable and showcase)
      const adoptablePets = await storage.getPets();
      const showcasePets = await storage.getShowcasePets();
      const allPets = [...adoptablePets, ...showcasePets];
      
      res.json(allPets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });
  
  app.post("/api/admin/pets", authenticateAdmin, async (req, res) => {
    try {
      const petData = insertPetSchema.parse(req.body);
      const pet = await storage.createPet(petData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create pet" });
    }
  });
  
  app.put("/api/admin/pets/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const petUpdate = req.body;
      
      const updatedPet = await storage.updatePet(id, petUpdate);
      if (!updatedPet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      res.json(updatedPet);
    } catch (error) {
      res.status(500).json({ message: "Failed to update pet" });
    }
  });
  
  app.delete("/api/admin/pets/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deletePet(id);
      
      if (!result) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      res.json({ message: "Pet deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pet" });
    }
  });
  
  // Admin Owners Management API routes
  app.get("/api/admin/owners", authenticateAdmin, async (req, res) => {
    try {
      const owners = await storage.getOwners();
      res.json(owners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch owners" });
    }
  });
  
  app.get("/api/admin/owners/pending", authenticateAdmin, async (req, res) => {
    try {
      const pendingOwners = await storage.getPendingOwners();
      res.json(pendingOwners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending owners" });
    }
  });
  
  app.post("/api/admin/owners", authenticateAdmin, async (req, res) => {
    try {
      const ownerData = insertOwnerSchema.parse(req.body);
      const owner = await storage.createOwner(ownerData);
      res.status(201).json(owner);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create owner" });
    }
  });
  
  app.put("/api/admin/owners/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ownerUpdate = req.body;
      
      const updatedOwner = await storage.updateOwner(id, ownerUpdate);
      if (!updatedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      
      res.json(updatedOwner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update owner" });
    }
  });
  
  app.put("/api/admin/owners/:id/approve", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const approvedOwner = await storage.approveOwner(id);
      if (!approvedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      
      res.json(approvedOwner);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve owner" });
    }
  });
  
  app.delete("/api/admin/owners/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteOwner(id);
      
      if (!result) {
        return res.status(404).json({ message: "Owner not found" });
      }
      
      res.json({ message: "Owner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete owner" });
    }
  });
  
  // Admin Reports Management API routes
  app.get("/api/admin/reports", authenticateAdmin, async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });
  
  app.get("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });
  
  app.put("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reportUpdate = req.body;
      
      const updatedReport = await storage.updateReport(id, reportUpdate);
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to update report" });
    }
  });
  
  // Admin Management API routes
  app.get("/api/admin/admins", authenticateAdmin, async (req, res) => {
    try {
      const admins = await storage.getAdmins();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });
  
  app.post("/api/admin/admins", authenticateAdmin, async (req, res) => {
    try {
      const adminData = insertAdminSchema.parse(req.body);
      
      // Check if admin with username already exists
      const existingAdmin = await storage.getAdminByUsername(adminData.username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const admin = await storage.createAdmin(adminData);
      res.status(201).json(admin);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create admin" });
    }
  });
  
  // Admin Products Management API routes
  app.get("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productUpdate = req.body;
      
      const updatedProduct = await storage.updateProduct(id, productUpdate);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteProduct(id);
      
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
