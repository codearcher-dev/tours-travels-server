import { Router } from 'express';
import { getAdmin, loginAdmin, logoutAdmin, registerAdmin } from '../controllers/admin.auth.controller.js';
import verifyAuthentication from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin);
router.route("/").get(verifyAuthentication, getAdmin);

const adminAuthRouter = router;

export default adminAuthRouter;