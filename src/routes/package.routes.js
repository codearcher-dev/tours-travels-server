import { Router } from "express";
import { createPackage, getOnePackage, getAllPackages, modifyPackage, deletePackage } from "../controllers/package.controller.js";

const router = Router();

router.route("/").post(createPackage);
router.route("/").get(getAllPackages);
router.route("/:id").get(getOnePackage);
router.route("/:id").patch(modifyPackage);
router.route("/:id").delete(deletePackage);

const packageRouter = router;
export default packageRouter;