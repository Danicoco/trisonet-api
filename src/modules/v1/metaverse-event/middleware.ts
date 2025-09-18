/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import MetaverseEventService from "./service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name } = req.body
    try {
        const [MetaverseEvent, error] = await tryPromise(
            new MetaverseEventService({
                name
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (MetaverseEvent) throw catchError("MetaverseEvent with this name already exist. Use another name", 400)

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
        const [MetaverseEvent, error] = await tryPromise(
            new MetaverseEventService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!MetaverseEvent) throw catchError("MetaverseEvent does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
