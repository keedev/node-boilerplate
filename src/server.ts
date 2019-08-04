import express from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { AppRoutes } from "./routes";
import { Logger } from "./common/logger";

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.Config();
        this.Routes();
    }

    private Routes(): void {
        AppRoutes.forEach(route => {
            this.app[route.method](route.path, (request, response, next) => {
                route.action(request, response)
                    .then(() => next)
                    .catch((err: any) => next(err));
            });
        });
    }

    private Config(): void {

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }


    public Start(): void {

        let port = process.env.PORT || 1337;
        this.app.listen(port, () => console.log(`Server started on port ${port}`));

        // to enable typeORM
        // createConnection().then(async connection => {
        //     let port = process.env.PORT || 1337;
        //     this.app.listen(port, () => console.log(`Server started on port ${port}`));
        // }).catch(error => {
        //     Logger.Log("TypeORM connection error: ", error);
        // })
    }

}

const server = new Server();

server.Start();