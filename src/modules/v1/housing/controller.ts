/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import HousingService from "./service"
import { composeFilter } from "./helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const [result, error] = await tryPromise(
            new HousingService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Housings fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [result, error] = await tryPromise(
            new HousingService({}).create({
                ...req.body,
                admin: String(req.user._id),
            })
        )
        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Housing created", result))
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [result, error] = await tryPromise(
            new HousingService({ _id: req.params._id }).update({
                ...req.body,
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Housing updated", result))
    } catch (error) {
        next(error)
    }
}
