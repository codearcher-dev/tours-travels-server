import { Router } from "express";
import { createInsight, getGlobalStat, getInsights, handleInitialLoad, handlePageVisit, handleWhatsappClick } from "../controllers/insight.controller.js";
import verifyAuthentication from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(handleInitialLoad);
router.route("/new").post(createInsight);
router.route("/").get(verifyAuthentication, getInsights);
router.route("/click").patch(handleWhatsappClick);
router.route("/visit").patch(handlePageVisit);
router.route("/global").get(verifyAuthentication, getGlobalStat);

const insightRouter = router;

export default insightRouter;