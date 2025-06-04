import express from "express";
import expressAsyncHandler from "express-async-handler";
import { deleteImageByPublicId } from "../utils.js";
import prisma from "../prisma/prisma.js";

const stationRouter = express.Router();

// Create Station
stationRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      logo,
      image,
      imageId,
      pms,
      ago,
      address,
      supportedOrdering,
      email,
      operatingHours,
      availableProducts,
      paymentMethods,
      facilities,
      ownerId,
    } = req.body;

    const station = await prisma.station.create({
      data: {
        name,
        image,
        imageId,
        logo,
        pms: Number(pms),
        ago: Number(ago),
        address,
        supportedOrdering,
        email,
        operatingHours,
        availableProducts,
        paymentMethods,
        facilities,
        owner: ownerId ? { connect: { id: ownerId } } : undefined,
      },
    });

    res.status(201).json(station);
  })
);

// Update Station
stationRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      name,
      image,
      imageId,
      logo,
      pms,
      ago,
      address,
      supportedOrdering,
      email,
      operatingHours,
      availableProducts,
      paymentMethods,
      facilities,
    } = req.body;

    const existingStation = await prisma.station.findUnique({
      where: { id },
    });

    if (!existingStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    const updatedStation = await prisma.station.update({
      where: { id },
      data: {
        name,
        image,
        imageId,
        logo,
        pms: Number(pms),
        ago: Number(ago),
        address,
        supportedOrdering,
        email,
        operatingHours,
        availableProducts,
        paymentMethods,
        facilities,
      },
    });

    res.json(updatedStation);
  })
);

// Delete Station By ID
stationRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the station exists and get imageId
    const station = await prisma.station.findUnique({
      where: { id },
      select: { imageId: true }, // only select what's needed
    });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Delete image from Cloudinary if it exists
    if (station.imageId) {
      try {
        await deleteImageByPublicId(station.imageId);
      } catch (err) {
        console.error("Failed to delete station image from Cloudinary:", err);
        // Optional: continue or abort depending on importance
      }
    }

    // Delete the station
    await prisma.station.delete({
      where: { id },
    });

    res.json({ message: "Station and image deleted successfully" });
  })
);

// Get All Station
stationRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const stations = await prisma.station.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(stations);
  })
);

// Get Stations By Owner ID
stationRouter.get(
  "/by-owner/:ownerId",
  expressAsyncHandler(async (req, res) => {
    const { ownerId } = req.params;
    const station = await prisma.station.findFirst({
      where: { ownerId },
    });
    res.json(station);
  })
);

// Get Stations Details
stationRouter.get(
  "/details/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const stations = await prisma.station.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            phone: true,
            country: true,
            address: true,
          },
        },
      },
    });

    if (!stations || stations.length === 0) {
      return res
        .status(404)
        .json({ message: "No stations found for this owner." });
    }

    res.json(stations);
  })
);

//create price
stationRouter.post(
  "/price",
  expressAsyncHandler(async (req, res) => {
    const { stationName, prices } = req.body;
    // prices: [{ type: "Regular", price: 1.2 }, { type: "Premium", price: 1.35 }]

    if (!stationName || !Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({
        message: "stationName and at least one petrol type price are required",
      });
    }

    const existingStation = await prisma.petrolPrice.findFirst({
      where: {
        stationName: { equals: stationName, mode: "insensitive" },
      },
    });

    if (existingStation) {
      return res.status(400).json({
        message: `Station "${stationName}" already exists.`,
      });
    }

    const newEntry = await prisma.petrolPrice.create({
      data: {
        stationName,
        priceAndType: {
          create: prices.map((p) => ({
            type: p.type,
            price: Number(p.price),
          })),
        },
      },
      include: { priceAndType: true },
    });

    res.status(201).json(newEntry);
  })
);

//Update price
stationRouter.put(
  "/price/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { stationName, prices } = req.body;
    // prices: [{ id: "abc123", type: "Regular", price: 1.3 }, { type: "Super", price: 1.6 }]

    const existing = await prisma.petrolPrice.findUnique({
      where: { id },
      include: { priceAndType: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Station not found" });
    }

    const updated = await prisma.petrolPrice.update({
      where: { id },
      data: {
        stationName,
        priceAndType: {
          deleteMany: {}, // remove all existing petrol types
          create: prices.map((p) => ({
            type: p.type,
            price: Number(p.price),
          })),
        },
      },
      include: { priceAndType: true },
    });

    res.json(updated);
  })
);

//get price
stationRouter.get(
  "/price",
  expressAsyncHandler(async (req, res) => {
    const prices = await prisma.petrolPrice.findMany({
      orderBy: { stationName: "asc" },
      include: { priceAndType: true },
    });

    res.json(prices);
  })
);

// Create vendor
stationRouter.post(
  "/vendor",
  expressAsyncHandler(async (req, res) => {
    const { fullName, phone, location, pms, userId } = req.body;

    try {
      const newVendor = await prisma.vendor.create({
        data: {
          fullName,
          phone,
          location,
          pms: Number(pms),
          user: { connect: { id: userId } },
        },
      });

      res.status(201).json(newVendor);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create vendor", error: error.message });
    }
  })
);

// Update vendor
stationRouter.put(
  "/vendor/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, phone, location, pms } = req.body;

    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    try {
      const updatedVendor = await prisma.vendor.update({
        where: { id },
        data: {
          fullName,
          phone,
          location,
          pms: Number(pms),
        },
      });

      res.json(updatedVendor);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update vendor", error: error.message });
    }
  })
);

//Get All Vendor
stationRouter.get(
  "/vendor",
  expressAsyncHandler(async (req, res) => {
    try {
      const vendors = await prisma.vendor.findMany({
        orderBy: { createdAt: "desc" }, // Optional: sort by latest
      });

      res.json(vendors);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch vendors", error: error.message });
    }
  })
);

// Delete Vendor
stationRouter.delete(
  "/vendor/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingVendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    try {
      await prisma.vendor.delete({ where: { id } });
      res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete vendor", error: error.message });
    }
  })
);

// Get vendor By Id
stationRouter.get(
  "/vendor/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: {
          user: true, // Optional: include user info
        },
      });

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.json(vendor);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch vendor", error: error.message });
    }
  })
);

// Get Station By Id
stationRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const station = await prisma.station.findUnique({
      where: { id },
    });

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json(station);
  })
);

export default stationRouter;
