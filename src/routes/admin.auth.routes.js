import { Router } from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin.auth.controller.js';

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
// router.route("/logout").get(getAdminProfile);

const adminAuthRouter = router;

export default adminAuthRouter;