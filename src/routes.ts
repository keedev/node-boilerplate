import { AppController } from "./controller";
import { Request, Response } from "express";

interface IRoute {
    path: string;
    method: "get" | "post" | "put" | "delete";
    action: (request: Request, response: Response) => Promise<void>
}

export const AppRoutes: IRoute[] = [
    {
        path: "/api/forecast",
        method: "get",
        action: AppController.GetForecast
    }
];