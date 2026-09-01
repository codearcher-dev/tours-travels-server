import { findGlobalStat, getSightByDateRange, storeGlobalStat, storeInsight, updateGlobalStatField, updateInsightField } from "../services/insight.services.js";
import crypto from 'crypto';

export const handleInitialLoad = async (req, res) => {
    if (req.body.v_id) {
        return res.status(200).json({ message: "v_id exists" });
    }
    try {
        const v_id = crypto.randomBytes(16).toString('hex');
        await updateInsightField("visitors");
        await updateGlobalStatField("visitors");
        return res.status(200).json({ message: "visitors updated", v_id })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const handleWhatsappClick = async (req, res) => {
    try {
        await updateInsightField("enquiryClicks.whatsapp");
        await updateGlobalStatField("enquiries");
        return res.status(200).json({ message: "click updated" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const handlePageVisit = async (req, res) => {
    try {
        await updateInsightField("pageViews");
        await updateGlobalStatField("pageViews");
        return res.status(200).json({ message: "views updated" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getInsights = async (req, res) => {
    const { start, end } = req.query;
    try {
        const insights = await getSightByDateRange(start, end);
        return res.status(200).json({ message: "Insights fetched", insights })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createInsight = async (req, res) => {
    try {
        const insight = await storeInsight();
        return res.status(201).json({ message: "Insight created", insight })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// export const updateInsight = async (req, res) => {
//     const data = req.body;

//     try {
//         const insight = await updateInsightField(data);
//         return res.status(200).json({ message: "Insight updated", insight })
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }

export const getGlobalStat = async (req, res) => {
    try {
        const stat = await findGlobalStat();
        return res.status(200).json({ message: "stat fetched", stat })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createGlobalStat = async (req, res) => {
    try {
        const stat = await storeGlobalStat();
        return res.status(201).json({ message: "stat created", stat })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// export const updateGlobalStat = async (req, res) => {
//     try {
//         const insight = await updateGlobalStatField("field");
//         return res.status(200).json({ message: "Insight updated", insight })
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }