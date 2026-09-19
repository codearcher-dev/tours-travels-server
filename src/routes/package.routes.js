import { Router } from "express";
import { createPackage, getOnePackage, getAllPackages, modifyPackage, deletePackage } from "../controllers/package.controller.js";
import { upload } from "../config/cloudinary.js";
import verifyAuthentication from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyAuthentication, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]), createPackage);
router.route("/").get(getAllPackages);
router.route("/:id").get(getOnePackage);
router.route("/:id").patch(verifyAuthentication, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'thumbnail', maxCount: 1 }]), modifyPackage);
router.route("/:id").delete(verifyAuthentication, deletePackage);

const packageRouter = router;
export default packageRouter;