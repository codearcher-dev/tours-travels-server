import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    duration: {
        days: {
            type: Number,
            required: true,
        },
        nights: {
            type: Number,
            required: true,
        }
    },
    destinations: [{
        type: String,
        required: true,
    }],
    price: {
        currency: {
            type: String,
            enum: ["INR", "USD", "EUR"],
            default: "INR"
        },
        actual: {
            type: Number,
            required: true,
        },
        discounted: {
            type: Number,
            required: true,
        }
    },
    description: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    images: [{ type: String }],
    slug: { type: String }
}, { timestamps: true })

const PackageModel = mongoose.model("package", packageSchema);

export default PackageModel;