import { port } from "./config";
import app from './app'
import Logger from "./Middleware/core/logger";
import http from "http";

const server = http.createServer(app);

server.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
});

export default server;