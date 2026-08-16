import AdminModel from "../models/admin.schema.js";

export const getAdminByEmail = async (email) => {
    const admin = await AdminModel.findOne({ email });
    return admin;
}

