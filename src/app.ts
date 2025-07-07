import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import { apiLogger } from "./Middleware/core/logger";
import routes from "./routes/routes";
import { NotFoundError, ApiError, ErrorType, InternalError } from "./Middleware/core/apiError";
import Logger from "./Middleware/core/logger";

process.on('uncaughtException', (e) => {
    Logger.error('this error', e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(apiLogger);

app.use(cors());

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));

const errorHandler: any = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        console.log(err);
        ApiError.handle(err, res);
        if (err.type === ErrorType.INTERNAL)
            Logger.error(
                `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
            );
    } else {
        console.log(err);
        Logger.error(
            `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
        );
        ApiError.handle(new InternalError(err.message), res);
    }
};

app.use(errorHandler);




export default app;


