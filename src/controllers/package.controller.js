import packageModel from "../models/packages.schema.js";

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
        const pkg = await packageModel.create(newPackage);
        return res.status(201).json({ message: "Package created successfully", package: pkg });
    } catch (error) {
        return res.status(500).json({ message: "Error creating package", error: error.message });
    }
}

