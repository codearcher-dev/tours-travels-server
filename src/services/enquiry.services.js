import EnquiryModel from "../models/enquiry.schema.js"

export const createEnquiry = async (data) => {
    const enquiry = await EnquiryModel.create(data);
    return enquiry;
}

export const findEnquiry = async (limit, offset, status) => {
    const enquiries = await EnquiryModel.find(status && { status }).limit(limit).skip(offset);
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