import { createEnquiry, deleteEnquiry, findEnquiry, updateEnquiryStatus } from "../services/enquiry.services.js";

export const handleCreateEnquiry = async (req, res) => {
    const data = req.body;
    try {
        const enquiry = await createEnquiry(data);
        return res.status(201).json({ message: "Enquiry created", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const handleRemoveEnquiry = async (req, res) => {
    const { id } = req.query;

    try {
        const enquiry = await deleteEnquiry(id);
        return res.status(200).json({ message: "Enquiry deleted", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const handleGetEnquiries = async (req, res) => {
    const { limit, offset, status } = req.query;

    try {
        const enquiries = await findEnquiry(limit, offset, status);
        return res.status(200).json({ message: "Enquiry feched", enquiries });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const handleUpdateStatus = async (req, res) => {
    try {
        const enquiry = await updateEnquiryStatus();
        return res.status(200).json({ message: "Status updated", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

