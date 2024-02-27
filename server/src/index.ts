import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { type IResponse } from "./interfaces/response.interface";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorHandler } from "./utils/errorHandler";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRoute } from "./routes/auth.route";
import { stripeRoute } from "./routes/stripe.route";
import { commentRoute } from "./routes/comment.route";

export const app: Express = express();

app.use(cors());
app.use("/api/v1/stripe/webhook", express.raw({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(helmet());

app.get("/", (req: Request, res: Response<IResponse>) => {
  return res.status(200).json({
    status: "success",
    message: "Server is alive",
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/comment", commentRoute);

app.get("*", (req: Request, res: Response) => {
  throw new ErrorHandler("Route doesn't exist", 404);
});

app.use(errorMiddleware);
