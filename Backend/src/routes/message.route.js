import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  getUserForSidebar,
  getMessages,
} from "../controllers/message.controller.js";

const router = Router();

router.route("/users").get(verifyJWT, getUserForSidebar);
router.route("/:id").get(verifyJWT, getMessages);

export default router;
