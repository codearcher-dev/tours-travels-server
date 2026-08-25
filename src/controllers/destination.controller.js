import { upload } from "../services/cloudinary.services.js";
import { createDestination, deleteDestinationById, findDestinationById, findDestinations, updateDestinationById } from "../services/destination.services.js"

export const getAllDestinations = async (req, res) => {
    try {
        const destinations = await findDestinations();
        return res.status(200).json({ message: "Destinations fetched successfully", count: destinations.length, destinations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getSingleDestination = async (req, res) => {
    const { id } = req.params;
    try {
        const destination = await findDestinationById(id);
        return res.status(200).json({ message: "Destination fetched successfully", destination });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createNewDestination = async (req, res) => {
    const data = req.body;

    try {
        const images = await upload(req);
        const destination = await createDestination({ ...data, images });
        return res.status(200).json({ message: "Destination created successfully", destination });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const removeDestination = async (req, res) => {
    const { id } = req.params;
    try {
        const destination = await deleteDestinationById(id);
        return res.status(200).json({ message: "Destination removed successfully", destination })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateDestination = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const destination = await updateDestinationById(id, data);
        return res.status(200).json({ message: "Destination updated successfully", destination });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}