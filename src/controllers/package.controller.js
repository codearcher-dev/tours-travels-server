import packageModel from "../models/packages.schema.js";
import { createNewPackage, findAllPackages, findPackageById } from "../services/package.services.js";

export const createPackage = async (req, res) => {
    const { name, location, duration, destinations, price, description, img, images } = req.body;
    if (!name || !location || !duration || !destinations || !price || !description || !img || !images) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const newPackage = {
        name,
        location,
        duration,
        destinations,
        price,
        description,
        img,
        images,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    };

    try {
        const pkg = await createNewPackage(newPackage);
        return res.status(201).json({ message: "Package created successfully", package: pkg });
    } catch (error) {
        return res.status(500).json({ message: "Error creating package", error: error.message });
    }
}

export const getAllPackages = async (req, res) => {
    try {
        const pkgs = await findAllPackages();
        return res.status(200).json({ message: "Packages fetched successfully", packages: pkgs });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching packages", error: error.message });
    }
}

export const getOnePackage = async (req, res) => {
    const { id } = req.params;
    try {
        const pkg = await findPackageById(id);
        return res.status(200).json({ message: "Package fetched successfully", package: pkg });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching package", error: error.message });
    }
}

