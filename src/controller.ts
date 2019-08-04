import { Request, Response } from "express";
import { ApiResult } from "./common/apiResult";

class Controller {

    /**
     * Get common students from a list of teachers
     * GET /api/commonstudents",
     * Query
     * @param teacher {string | string[]}
     */
    GetForecast = async (req: Request, res: Response) => {
        try {
            const params = req.query["teacher"];
            let emailList: string[] = Array.isArray(params) ? params : [params];
            let studentList: string[][] = [];


            ApiResult.OK(res, { students: {} });

        } catch (e) {
            ApiResult.Error(res, e);
        }
    }
}

const AppController = new Controller();

export { AppController }