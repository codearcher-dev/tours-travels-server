import { Router } from 'express';
import { loginAdmin, logoutAdmin, registerAdmin } from '../controllers/admin.auth.controller.js';

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin);

const adminAuthRouter = router;

export default adminAuthRouter;