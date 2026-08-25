import { Router } from "express";
import { createNewDestination, getAllDestinations, getSingleDestination, removeDestination, updateDestination } from "../controllers/destination.controller.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.route("/").get(getAllDestinations);
router.route("/").post(upload.array('images', 10), createNewDestination);
router.route("/:id").get(getSingleDestination);
router.route("/:id").patch(updateDestination);
router.route("/:id").delete(removeDestination);

const destinationRouter = router;

export default destinationRouter;