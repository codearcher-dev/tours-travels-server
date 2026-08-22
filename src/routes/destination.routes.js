import { Router } from "express";
import { createNewDestination, getAllDestinations, getSingleDestination, removeDestination, updateDestination } from "../controllers/destination.controller.js";

const router = Router();

router.route("/").get(getAllDestinations);
router.route("/").post(createNewDestination);
router.route("/:id").get(getSingleDestination);
router.route("/:id").patch(updateDestination);
router.route("/:id").delete(removeDestination);

const destinationRouter = router;

export default destinationRouter;