/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import EventService from "./service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title } = req.body
    try {
        const [event, error] = await tryPromise(
            new EventService({
                title
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (event) throw catchError("Event with this name already exist. Use another name", 400)

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
        const [Event, error] = await tryPromise(
            new EventService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!Event) throw catchError("Event does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
