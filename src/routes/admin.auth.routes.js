import { Router } from 'express';
import { createAdmin, loginAdmin } from '../controllers/admin.auth.controller.js';

const router = Router();

router.route("/register").post(createAdmin);
router.route("/login").post(loginAdmin);
// router.route("/logout").get(getAdminProfile);

const adminAuthRouter = router;

export default adminAuthRouter;