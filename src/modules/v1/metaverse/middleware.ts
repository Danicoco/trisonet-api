/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import MetaverseService from "./service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [metaverse, error] = await tryPromise(
            new MetaverseService({
                user: req.user._id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (metaverse?.avatar) throw catchError("User already added avatar", 400)

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
    const { _id } = req.user
    try {
        const [Metaverse, error] = await tryPromise(
            new MetaverseService({
                user: _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!Metaverse) throw catchError("Metaverse does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
