import { Router } from "express";
import { handleCountEnquiries, handleCreateEnquiry, handleGetEnquiries, handleRemoveEnquiry, handleUpdateStatus } from "../controllers/enquiry.controller.js";
import verifyAuthentication from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyAuthentication, handleGetEnquiries);
router.route("/").post(handleCreateEnquiry);
router.route("/:id").patch(verifyAuthentication, handleUpdateStatus);
router.route("/:id").delete(verifyAuthentication, handleRemoveEnquiry);
router.route('/:status').get(verifyAuthentication, handleCountEnquiries);

const enquiryRouter = router;

export default enquiryRouter;