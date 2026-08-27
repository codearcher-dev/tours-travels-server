import { createFeedback, deleteFeedback, findFeedbacks } from "../services/feedback.services.js"

export const createNewFeedback = async (req, res) => {
    const data = req.body;
    try {
        const feedback = await createFeedback(data);
        return res.status(200).json({ message: "Feedback created successfully", feedback })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getFeedbacks = async (req, res) => {
    const { limit, offset } = req.query;
    try {
        const feedbacks = await findFeedbacks(limit, offset);
        console.log(feedbacks);
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