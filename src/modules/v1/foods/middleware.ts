/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import FoodService from "./service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title } = req.body
    try {
        const [Food, error] = await tryPromise(
            new FoodService({
                title
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (Food) throw catchError("Food with this name already exist. Use another name", 400)

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
        const [Food, error] = await tryPromise(
            new FoodService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!Food) throw catchError("Food does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
