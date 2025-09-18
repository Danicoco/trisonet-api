/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import HousingService from "./service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title } = req.body
    try {
        const [Housing, error] = await tryPromise(
            new HousingService({
                title
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (Housing) throw catchError("Housing with this name already exist. Use another name", 400)

        return next()
    } catch (error) {
        next(error)
    }
}


export const validateUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    try {
        const [Housing, error] = await tryPromise(
            new HousingService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!Housing) throw catchError("Housing does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
