import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/users").get(getUserForSidebar);
router.route("/:id").get(getMessages);
router.route("/send/:id").post(sendMessage);

export default router;
