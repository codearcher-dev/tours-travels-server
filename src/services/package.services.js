import PackageModel from "../models/packages.schema.js";

export const createNewPackage = async (newPackage) => {
    const pkg = await PackageModel.create(newPackage);
    return pkg;
}

export const findAllPackages = async () => {
    const pkgs = await PackageModel.find();
    return pkgs;
}

export const findPackageById = async (id) => {
    const pkg = await PackageModel.findById(id);
    return pkg;
}

export const updatePackageById = async (id, data) => {
    const updatedPkg = await PackageModel.findByIdAndUpdate(id, data);
    return updatedPkg;
}