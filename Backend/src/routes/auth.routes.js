import { Router } from "express";
import {
  userSignup,
  userLogin,
  userLogout,
  updateProfile,
  checkAuth,
} from "../controllers/userAuth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/update-profile").put(verifyJWT, updateProfile);
router.route("/check").get(checkAuth);

export default router;
