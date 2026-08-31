import { Router } from "express";
import { createInsight, getInsights, handleInitialLoad, handlePageVisit, handleWhatsappClick } from "../controllers/insight.controller.js";

const router = Router();

router.route("/").post(handleInitialLoad);
router.route("/new").post(createInsight);
router.route("/").get(getInsights);
router.route("/click").patch(handleWhatsappClick);
router.route("/visit").patch(handlePageVisit);

const insightRouter = router;

export default insightRouter;