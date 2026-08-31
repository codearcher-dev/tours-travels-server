import DestinationModel from "../models/destinations.schema.js";
import EnquiryModel from "../models/enquiry.schema.js";
import { GlobalStatModel, InsightModel } from "../models/insight.schema.js"
import PackageModel from "../models/packages.schema.js";

export const storeInsight = async () => {
    const data = {
        visitors: 0,
        enquiryClicks: {
            form: 0,
            whatsapp: 0,
        },
        pageViews: 0
    }
    const insight = await InsightModel.create(data);
    return insight;
}

export const updateInsightField = async (field) => {
    const insight = await InsightModel.findOneAndUpdate(
        {},
        { $inc: { [field]: 1 } }, // 1. Uses computed property name
        {
            returnDocument: 'after',
            sort: { createdAt: -1 } // 2. Correct way to sort in findOneAndUpdate
        }
    );

    return insight;
};

export const getSightByDateRange = async (startDate, endDate) => {
    // 1. Resolve start date (default to 7 days ago if missing)
    const start = startDate
        ? new Date(startDate)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 2. Resolve end date (default to now if missing)
    const end = endDate
        ? new Date(endDate)
        : new Date();

    // 3. Optional but recommended: Adjust end date to the very end of that day 
    // if it's passed as a YYYY-MM-DD string without time components.
    if (endDate && typeof endDate === 'string' && !endDate.includes('T')) {
        end.setHours(23, 59, 59, 999);
    }

    // 4. Query the database
    const insights = await InsightModel.find({
        createdAt: {
            $gte: start,
            $lte: end
        }
    });
    return insights;
};


export const storeGlobalStat = async () => {
    const data = {
        packages: await PackageModel.countDocuments(),
        destinations: await DestinationModel.countDocuments(),
        visitors: 0,
        enquiries: await EnquiryModel.countDocuments(),
        pageViews: 0
    }
    const stat = await GlobalStatModel.create(data);
    return stat;
}

export const updateGlobalStatField = async (field) => {
    if ((await GlobalStatModel.find()).length === 0) {
        await storeGlobalStat();
    }
    const stat = await GlobalStatModel.findOneAndUpdate({},
        { $inc: { [field]: 1 } }, // 1. Uses computed property name
        { returnDocument: 'after', });
    return stat;
}

export const findGlobalStat = async () => {
    const stats = await GlobalStatModel.findOne();
    return stats;
}
