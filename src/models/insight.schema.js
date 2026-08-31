import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
    visitors: { type: Number, default: 0 },
    enquiryClicks: {
        form: { type: Number, default: 0 },
        whatsapp: { type: Number, default: 0 }
    },
    pageViews: { type: Number, default: 0 }

}, { timestamps: true });

const globalStats = new mongoose.Schema({
    packages: { type: Number },
    destinations: { type: Number },
    visitors: { type: Number },
    enquiries: { type: Number },
    pageViews: { type: Number }
}, { timestamps: true });

export const InsightModel = mongoose.model('Insight', insightSchema);
export const GlobalStatModel = mongoose.model('GlobalStat', globalStats);

