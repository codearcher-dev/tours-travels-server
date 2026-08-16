import AdminModel from "../models/admin.schema.js";
import { authenticateAdmin, hashPassword, verifyPassword } from "../services/auth.services.js";

export const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    if ((await AdminModel.find()).length >= 2) {
        res.status(201).json({ message: "Maximum No. of Admins reached" });
    }

    try {
        const adminExist = await AdminModel.findOne({ email });
        if (adminExist) {
            return res.status(401).json({ message: "Admin already exist" });
        }
        const admin = await AdminModel.create({ name, email, password: hashPassword(password) });
        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
}

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        if (!verifyPassword(password, admin.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await authenticateAdmin(req, res, admin);
        res.status(200).json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
}