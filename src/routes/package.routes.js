import { Router } from "express";
import { createPackage, getOnePackage, getAllPackages, modifyPackage, deletePackage } from "../controllers/package.controller.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.route("/").post(upload.array('images', 10), createPackage);
router.route("/").get(getAllPackages);
router.route("/:id").get(getOnePackage);
router.route("/:id").patch(upload.array('images', 10), modifyPackage);
router.route("/:id").delete(deletePackage);

const packageRouter = router;
export default packageRouter;