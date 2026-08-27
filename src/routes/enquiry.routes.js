import { Router } from "express";
import { handleCountEnquiries, handleCreateEnquiry, handleGetEnquiries, handleRemoveEnquiry, handleUpdateStatus } from "../controllers/enquiry.controller.js";

const router = Router();

router.route("/").get(handleGetEnquiries);
router.route("/").post(handleCreateEnquiry);
router.route("/:id").patch(handleUpdateStatus);
router.route("/:id").delete(handleRemoveEnquiry);
router.route('/:status').get(handleCountEnquiries);

const enquiryRouter = router;

export default enquiryRouter;