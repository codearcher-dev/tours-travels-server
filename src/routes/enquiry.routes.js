import { Router } from "express";
import { handleCreateEnquiry, handleGetEnquiries, handleRemoveEnquiry, handleUpdateStatus } from "../controllers/enquiry.controller.js";

const router = Router();

router.route("/").get(handleGetEnquiries);
router.route("/").post(handleCreateEnquiry);
router.route("/:id").patch(handleUpdateStatus);
router.route("/:id").delete(handleRemoveEnquiry);

const enquiryRouter = router;

export default enquiryRouter;