import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    package: { type: String, required: true },
    questions: [{ type: String }],
    token: { type: String, required: true },
    url: { type: String },
    isValid: { type: Boolean, default: true }
}, { timestamps: true });

const FeedbackLinkModel = mongoose.model("FeedbackLink", linkSchema);

export default FeedbackLinkModel;