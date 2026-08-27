import packageModel from "../models/packages.schema.js";
import { upload } from "../services/cloudinary.services.js";
import { createNewPackage, deletePackageById, findAllPackages, findPackageById, findPublicIds, updatePackageById } from "../services/package.services.js";
import { deleteImages } from "../utils/deleteFromCloudinary.js";

export const createPackage = async (req, res) => {
    const { name, location, duration, destinations, price, description, inclusions, exclusions, itinerary } = JSON.parse(req.body.data);
    if (!name || !location || !duration || !destinations || !price || !description) {
        return res.status(400).json({ message: "Please fill the required fields" });
    }

    try {
        const images = req.files ? await upload(req) : [];
        images.forEach((img) => {
            img.publicId = img.public_id;
            delete img.public_id;
        });
        const newPackage = {
            name,
            location,
            duration,
            destinations,
            price,
            description,
            img: images[0] || {},
            images: images,
            inclusions,
            exclusions,
            itinerary,
            slug: name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace all symbols and spaces with a hyphen
                .replace(/^-+|-+$/g, '')    // Remove leading and trailing hyphens (optional but recommended)
        };
        const pkg = await createNewPackage(newPackage);
        return res.status(201).json({ message: "Package created successfully", package: pkg });
    } catch (error) {
        console.error("Error creating Package : ", error.message)
        return res.status(500).json({ message: "Error creating package", error: error.message });
    }
}

export const modifyPackage = async (req, res) => {
    const { id } = req.params;
    const { name, location, duration, destinations, price, description, inclusions, exclusions, itinerary, images, slug } = JSON.parse(req.body.data);
    if (!name || !location || !duration || !destinations || !price || !description) {
        return res.status(400).json({ message: "Please fill the required fields" });
    }

    const publicIds = req.body.public_id.split(',');
    const filteredImages = images.filter((i) => Object.keys(i).length > 0);

    try {
        if (publicIds.length > 0) {
            const result = await deleteImages(publicIds);
            console.log("Result : ", result)
        } else {
            console.log("No Public Ids");
        }

        const files = req.files ? await upload(req) : [];
        files.forEach((f) => {
            f.publicId = f.public_id;
            delete f.public_id;
        });
        const updatedPackage = {
            name,
            location,
            duration,
            destinations,
            price,
            description,
            img: files[0] || {},
            images: [...filteredImages, ...files],
            inclusions,
            exclusions,
            itinerary,
            slug
        };
        const pkg = await updatePackageById(id, updatedPackage);
        console.log("success");
        return res.status(200).json({ message: "Package updated successfully", package: pkg });
    } catch (error) {
        console.error("Error Updating Package : ", error.message)
        return res.status(500).json({ message: "Error updating package", error: error });
    }
}

export const getAllPackages = async (req, res) => {
    try {
        const pkgs = await findAllPackages();
        return res.status(200).json({ message: "Packages fetched successfully", count: pkgs.length, packages: pkgs });
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

export const deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        const publicIds = await findPublicIds(id);
        console.log("Public Ids : ", publicIds);
        if (publicIds.length > 0) {
            const result = await deleteImages(publicIds);
            console.log(result);
        } else {
            console.log("Not provided");
        }
        const pkg = await deletePackageById(id);
        return res.status(200).json({ message: "Package deleted successfully", package: pkg });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Error deleting package", error: error.message });
    }
}

