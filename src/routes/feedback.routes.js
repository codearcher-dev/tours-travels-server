import { Router } from "express";
import { createNewFeedback, getFeedbacks, removeFeedback, createFeedbackLink, getFeedbackLinks, removeFeedbackLink, getFeedbackLink } from "../controllers/feedback.controller.js";
import FeedbackModel from "../models/feedback.schema.js";
import verifyAuthentication from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getFeedbacks);
router.route("/:token").post(createNewFeedback);
router.route("/:id").delete(verifyAuthentication, removeFeedback);

router.route("/link").get(getFeedbackLinks);
router.route("/link/:token").get(getFeedbackLink);
router.route("/link/create").post(verifyAuthentication, createFeedbackLink);
router.route("/link/:id").delete(verifyAuthentication, removeFeedbackLink);

const feedbackRouter = router;

export default feedbackRouter;