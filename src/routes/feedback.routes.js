import { Router } from "express";
import { createNewFeedback, getFeedbacks, removeFeedback } from "../controllers/feedback.controller.js";
import FeedbackModel from "../models/feedback.schema.js";

const router = Router();

router.route("/").get(getFeedbacks);
router.route("/").post(createNewFeedback);
router.route("/:id").delete(removeFeedback);

const feedbackRouter = router;

export default feedbackRouter;