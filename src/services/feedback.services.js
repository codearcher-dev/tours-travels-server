import FeedbackLinkModel from "../models/feedback.link.schema.js";
import FeedbackModel from "../models/feedback.schema.js";

export const findFeedbacks = async (limit, offset) => {
    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
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

export const createLink = async (packageName, questions) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const url = `https://www.primetraveller.in/feedback/${token}`;
    const feedbackLink = await FeedbackLinkModel.create({ package: packageName, questions, token, url });
    return feedbackLink;
}

export const findFeedbackLinks = async (limit, offset) => {
    const feedbackLinks = await FeedbackLinkModel.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
    return feedbackLinks;
}

export const findFeedbackLinkByToken = async (token) => {
    const feedbackLink = await FeedbackLinkModel.findOne({ token });
    return feedbackLink;
};

export const deleteFeedbackLink = async (id) => {
    const feedbackLink = await FeedbackLinkModel.findByIdAndDelete(id);
    return feedbackLink;
};

export const deleteFeedbackLinkByToken = async (token) => {
    const feedbackLink = await FeedbackLinkModel.findOneAndDelete({ token });
    return feedbackLink;
}