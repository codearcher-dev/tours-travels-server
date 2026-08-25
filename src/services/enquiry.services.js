import EnquiryModel from "../models/enquiry.schema.js"

export const createEnquiry = async (data) => {
    const enquiry = await EnquiryModel.create(data);
    return enquiry;
}

export const findEnquiry = async (limit, offset, status, search) => {
    const filter = {};

    if (status && status.trim() !== '') {
        filter.status = status.trim();
    }

    if (search && search.trim !== '') {
        const regex = { $regex: search.trim(), $options: 'i' };

        filter.$or = [
            { name: regex },
            { package: regex }
        ]
    }
    const enquiries = await EnquiryModel.find(filter).limit(limit).skip(offset);
    return enquiries;
}

export const deleteEnquiry = async (id) => {
    const enquiry = await EnquiryModel.findByIdAndDelete(id);
    return enquiry;
}

export const updateEnquiryStatus = async (id) => {
    const enquiry = await EnquiryModel.findByIdAndUpdate(id, {
        $set: {
            status: "completed"
        }
    }, { returnDocument: 'after' })

    return enquiry;
}