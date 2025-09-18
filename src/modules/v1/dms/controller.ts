/** @format */

import { NextFunction, Request, Response } from "express"

import DMService from "./service"
import { catchError, success, tryPromise } from "../../common/utils"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit, user } = req.query
    try {
        const [result, error] = await tryPromise(
            new DMService({}).findAll(
                {
                    $or: [
                        { user: String(user || req.user._id) },
                        { sender: String(user || req.user._id) }
                    ]
                },
                Number(page),
                Number(limit),
                [
                    { path: "user", select: "firstName lastName avatar" },
                    { path: "sender", select: "firstName lastName avatar" },
                ]
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("DMs fetched", result))
    } catch (error) {
        next(error)
    }
}

