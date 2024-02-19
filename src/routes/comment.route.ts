import { Router } from "express";
import { getAllComment, postComment } from "../controllers/comment.controller";
import { privateRoute } from "../middleware/auth.middleware";
import { userRole } from "../middleware/role.middleware";

const router: Router = Router();

router.use(privateRoute, userRole(["ADMIN", "REVIEWER"]));

router.route("/").get(getAllComment).post(postComment);

export { router as commentRoute };
