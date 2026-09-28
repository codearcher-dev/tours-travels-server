import { createFeedback, deleteFeedback, findFeedbacks, createLink, findFeedbackLinks, deleteFeedbackLink, findFeedbackLinkByToken, deleteFeedbackLinkByToken } from "../services/feedback.services.js"

export const createNewFeedback = async (req, res) => {
    const { token } = req.params;
    const data = req.body;
    try {
        const feedbackLink = await findFeedbackLinkByToken(token);

        if (!feedbackLink) {
            console.error("Error creating feedback link:");
            return res.status(404).json({ message: "Invalid feedback link" });
        }
        const feedback = await createFeedback(data);
        await deleteFeedbackLinkByToken(token);
        return res.status(200).json({ message: "Feedback created successfully", feedback })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getFeedbacks = async (req, res) => {
    const { limit, offset } = req.query;
    try {
        const feedbacks = await findFeedbacks(limit, offset);
        return res.status(200).json({ message: "Feedback fetched successfully", count: feedbacks.length, feedbacks })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const removeFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await deleteFeedback(id);
        return res.status(200).json({ message: "Feedback deleted successfully", feedback })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createFeedbackLink = async (req, res) => {
    const data = req.body;
    try {
        const feedbackLink = await createLink(data.package, data.questions);
        return res.status(200).json({ message: "Feedback link created successfully", link: feedbackLink })
    } catch (error) {
        console.error("Error creating feedback link:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const getFeedbackLinks = async (req, res) => {
    try {
        const links = await findFeedbackLinks();
        return res.status(200).json({ message: "Feedback links fetched successfully", count: links.length, links })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getFeedbackLink = async (req, res) => {
    const token = req.params.token;
    try {
        const link = await findFeedbackLinkByToken(token);
        return res.status(200).json({ message: "Feedback link fetched successfully", link })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const removeFeedbackLink = async (req, res) => {
    const { id } = req.params;
    try {
        const link = await deleteFeedbackLink(id);
        return res.status(200).json({ message: "Feedback link deleted successfully", link })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}