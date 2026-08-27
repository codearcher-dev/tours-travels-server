import DestinationModel from "../models/destinations.schema.js";

export const createDestination = async (data) => {
    const dest = await DestinationModel.create(data);
    return dest;
}

export const findDestinations = async () => {
    const dest = await DestinationModel.find();
    return dest;
}

export const findDestinationById = async (id) => {
    const dest = await DestinationModel.findById(id);
    return dest;
}

export const deleteDestinationById = async (id) => {
    const dest = await DestinationModel.findByIdAndDelete(id);
    return dest;
}

export const updateDestinationById = async (id, data) => {
    const dest = await DestinationModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    return dest;
}

export const findPublicIds = async (id) => {
    const pkg = await DestinationModel.findById(id).select("images.publicId");
    const publicIds = [];
    pkg.images.forEach(i => publicIds.push(i.publicId));
    return publicIds;
}