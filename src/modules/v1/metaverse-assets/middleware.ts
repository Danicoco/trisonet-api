/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import MetaversePropertyService from "./service"


export const validateUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    try {
        const [prop, error] = await tryPromise(
            new MetaversePropertyService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!prop) throw catchError("Property does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
