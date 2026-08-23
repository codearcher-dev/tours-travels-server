import mongoose from "mongoose";

const dayPlanSchema = new mongoose.Schema({
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    activities: [{
        name: { type: String, required: true },
        notes: { type: String },
        isExtraCharge: { type: Boolean, default: false },
        extraChargeAmount: { type: Number, default: 0 }
    }],
    mealsIncluded: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false }
    }
}, { _id: false });

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    location: {
        name: { type: String, required: true },
        url: { type: String }
    },
    duration: {
        days: { type: Number, required: true },
        nights: { type: Number, required: true }
    },
    price: {
        currency: { type: String, default: 'INR' },
        actual: { type: Number, required: true },
        discounted: { type: Number, required: true }
    },
    img: { url: { type: String, required: true }, publicId: { type: String } },
    images: [{ url: { type: String }, publicId: { type: String } }],
    destinations: [{ type: String, trim: true }],
    inclusions: [{ type: String, trim: true }], // Inclusions
    exclusions: [{ type: String, trim: true }],
    itinerary: [dayPlanSchema], // Dynamic Day-wise Array
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const PackageModel = mongoose.model("Package", packageSchema);

export default PackageModel;