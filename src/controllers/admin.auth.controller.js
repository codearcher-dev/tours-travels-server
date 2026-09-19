import AdminModel from "../models/admin.schema.js";
import { createAdmin, getAdminByEmail, getAllAdmins } from "../services/admin.services.js";
import { authenticateAdmin } from "../services/auth.services.js";
import { verifyPassword } from "../services/bcrypt.services.js";
import { deleteSessionById } from "../services/session.services.js";

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    if ((await getAllAdmins()).length >= 2) {
        res.status(201).json({ message: "Maximum No. of Admins reached" });
    }

    try {
        const adminExist = await getAdminByEmail(email);
        if (adminExist) {
            return res.status(401).json({ message: "Admin already exist" });
        }
        const admin = await createAdmin(name, email, password);
        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
}

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await getAdminByEmail(email);
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

export const logoutAdmin = async (req, res) => {
    const { sessionId } = req.user;
    try {
        await deleteSessionById(sessionId);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
}

export const getAdmin = async (req, res) => {
    const { email } = req.user;
    try {
        const admin = await getAdminByEmail(email);
        return res.status(200).json({ user: admin });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin", error: error.message });
    }
}