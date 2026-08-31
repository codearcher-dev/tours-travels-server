import FeedbackModel from "../models/feedback.schema.js";

export const findFeedbacks = async (limit, offset) => {
    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 }).limit(limit).skip(offset).populate("package", "name");
    return feedbacks;
}

export const createFeedback = async (data) => {

    const overallRating = data.feedback.reduce((acc, val) => acc + val.rating, 0) / data.feedback.length;
    const feedback = await FeedbackModel.create({ ...data, overallRating });
    return feedback;
}

export const deleteFeedback = async (id) => {
    const feedback = await FeedbackModel.findByIdAndDelete(id);
    return feedback;
}