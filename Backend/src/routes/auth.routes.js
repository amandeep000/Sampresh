import { Router } from "express";
import {
  userSignup,
  userLogin,
  userLogout,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/signup").get(userSignup);
router.route("/login").get(userLogin);
router.route("/logout").get(userLogout);

export default router;
