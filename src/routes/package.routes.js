import { Router } from "express";
import { createPackage, getOnePackage, getAllPackages, modifyPackage } from "../controllers/package.controller.js";

const router = Router();

router.route("/").post(createPackage);
router.route("/").get(getAllPackages);
router.route("/:id").get(getOnePackage);
router.route("/:id").patch(modifyPackage);

const packageRouter = router;
export default packageRouter;