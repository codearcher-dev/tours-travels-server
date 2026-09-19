import AdminModel from "../models/admin.schema.js";
import { hashPassword } from "./bcrypt.services.js";

export const getAllAdmins = async () => {
    const admins = await AdminModel.find();
    return admins;
}

export const getAdminByEmail = async (email) => {
    const admin = await AdminModel.findOne({ email });
    return admin;
}

export const createAdmin = async (name, email, password) => {
    const admin = await AdminModel.create({ name, email, password: hashPassword(password) });
    return admin;
}

export const updatePasswordByEmail = async (email, newPassword) => {
    const updatedAdmin = await AdminModel.findOneAndUpdate(
        { email },
        { password: hashPassword(newPassword) },
        { returnDocument: 'after' }
    );
    return updatedAdmin;
}