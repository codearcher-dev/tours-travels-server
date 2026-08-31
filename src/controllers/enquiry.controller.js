import { countEnquiryWithStatus, createEnquiry, deleteEnquiry, findEnquiry, updateEnquiryStatus } from "../services/enquiry.services.js";
import { updateGlobalStatField, updateInsightField } from "../services/insight.services.js";

export const handleCreateEnquiry = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
        const enquiry = await createEnquiry(data);
        if (enquiry) {
            await updateInsightField("enquiryClicks.form");
            await updateGlobalStatField("enquiries");
        }
        return res.status(201).json({ message: "Enquiry created", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const handleRemoveEnquiry = async (req, res) => {
    const { id } = req.params;

    console.log(id);
    try {
        const enquiry = await deleteEnquiry(id);
        return res.status(200).json({ message: "Enquiry deleted", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const handleGetEnquiries = async (req, res) => {
    const { limit, offset, status, search } = req.query;

    console.log(req.query);

    try {
        const enquiries = await findEnquiry(limit, offset, status, search);
        return res.status(200).json({ message: "Enquiry feched", count: enquiries.length, enquiries });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const handleUpdateStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await updateEnquiryStatus(id);
        return res.status(200).json({ message: "Status updated", enquiry });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const handleCountEnquiries = async (req, res) => {
    const { status } = req.params;
    try {
        const count = await countEnquiryWithStatus(status);
        return res.status(200).json({ message: "Counted successfully", count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

