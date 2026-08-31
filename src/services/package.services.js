import PackageModel from "../models/packages.schema.js";

export const createNewPackage = async (newPackage) => {
    const pkg = await PackageModel.create(newPackage);
    return pkg;
}

export const findAllPackages = async () => {
    const pkgs = await PackageModel.find().sort({ createdAt: -1 });
    return pkgs;
}

export const findPackageById = async (id) => {
    const pkg = await PackageModel.findById(id);
    return pkg;
}

export const updatePackageById = async (id, data) => {
    const updatedPkg = await PackageModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    return updatedPkg;
}

export const deletePackageById = async (id) => {
    const deletedPackage = await PackageModel.findByIdAndDelete(id);
    return deletedPackage;
}

export const findPublicIds = async (id) => {
    const pkg = await PackageModel.findById(id).select("images.publicId");
    const publicIds = [];
    pkg.images.forEach(i => publicIds.push(i.publicId));
    return publicIds;
}