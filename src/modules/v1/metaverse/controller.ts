/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import MetaverseService from "./service"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {        
        const [result, error] = await tryPromise(
            new MetaverseService({}).findAll(
                {},
                Number(page),
                Number(limit),
                // [{ path: "user", select: "firstName lastName avatar" }]
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Metaverse fetched", result))
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
        const result = await new MetaverseService({}).create({ user: req.user._id, ...req.body })
        
        return res.status(201).json(success("Avatar created", result))
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
            new MetaverseService({ user: req.user._id }).update({
                ...req.body,
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Avatar updated", result))
    } catch (error) {
        next(error)
    }
}

export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [result, error] = await tryPromise(
            new MetaverseService({ user: req.user._id }).findOne()
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Metaverse retrieved", result))
    } catch (error) {
        next(error)
    }
}
