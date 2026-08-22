import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    places: [
        { type: String }
    ],
    images: [{
        url: { type: String },
        publicId: { type: String },
    }]
}, { timestamps: true });

const DestinationModel = mongoose.model("Destination", destinationSchema);

export default DestinationModel;