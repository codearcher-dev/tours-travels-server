import { Router } from 'express';
import { changePassword, getAdmin, loginAdmin, logoutAdmin, registerAdmin } from '../controllers/admin.auth.controller.js';
import verifyAuthentication from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(verifyAuthentication, registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin);
router.route("/").get(verifyAuthentication, getAdmin);
router.route("/password").patch(verifyAuthentication, changePassword);

const adminAuthRouter = router;

export default adminAuthRouter;