import { Router } from "express";
import { createNewDestination, getAllDestinations, getSingleDestination, removeDestination, updateDestination } from "../controllers/destination.controller.js";
import { upload } from "../config/cloudinary.js";
import verifyAuthentication from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllDestinations);
router.route("/").post(verifyAuthentication, upload.array('images', 10), createNewDestination);
router.route("/:id").get(getSingleDestination);
router.route("/:id").patch(verifyAuthentication, upload.array('images', 10), updateDestination);
router.route("/:id").delete(verifyAuthentication, removeDestination);

const destinationRouter = router;

export default destinationRouter;