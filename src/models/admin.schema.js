import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fcmToken: [
        { type: String }
    ]
}, { timestamps: true });

const AdminModel = mongoose.model('admin', adminSchema);
export default AdminModel;