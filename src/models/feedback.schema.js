import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    package: { type: String, required: true },
    feedback: [{
        question: { type: String },
        rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true }
    }],
    overallRating: { type: Number },
    review: { type: String }
}, { timestamps: true });

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;
