import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { reportCrueltySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for pets
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

  // API routes for showcase pets (non-adoptable)
  app.get("/api/pets/showcase", async (req, res) => {
    try {
      const pets = await storage.getShowcasePets();
      res.json(pets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch showcase pets" });
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

  const httpServer = createServer(app);
  return httpServer;
}
