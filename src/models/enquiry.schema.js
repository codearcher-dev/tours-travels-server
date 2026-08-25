import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    package: { type: String, required: true },
    adults: { type: Number, required: true },
    kids: { type: Number, default: 0 },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { timestamps: true });

const EnquiryModel = mongoose.model("Enquiry", enquirySchema);

export default EnquiryModel;