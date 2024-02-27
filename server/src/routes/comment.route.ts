import { Router } from "express";
import {
  deleteComment,
  getUserComment,
  postComment,
  updateComment,
} from "../controllers/comment.controller";
import { privateRoute } from "../middleware/auth.middleware";
import { userRole } from "../middleware/role.middleware";
import { commentSchema } from "../schema/comment.schema";
import { validateSchema } from "../middleware/validateSchema.middleware";

const router: Router = Router();

router.use(privateRoute, userRole(["ADMIN", "REVIEWER"]));

router
  .route("/")
  .get(getUserComment)
  .post(validateSchema(commentSchema), postComment);

router.patch("/:id", validateSchema(commentSchema), updateComment);

router.delete("/:id", deleteComment);

export { router as commentRoute };
