import PackageModel from "../models/packages.schema.js";

export const createNewPackage = async (newPackage) => {
    const pkg = await PackageModel.create(newPackage);
    return pkg;
}