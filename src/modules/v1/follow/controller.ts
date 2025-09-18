/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import FollowService from "./service"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit, status = "followers" } = req.query
    try {
        const [result, error] = await tryPromise(
            new FollowService({}).findAll(
                {
                    ...(status === "followers" && { following: req.user._id }),
                    ...(status === "following" && { user: req.user._id }),
                },
                Number(page),
                Number(limit),
                [
                    { path: "user", select: "firstName lastName avatar" },
                    { path: "following", select: "firstName lastName avatar" },
                ]
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Followers fetched", result))
    } catch (error) {
        next(error)
    }
}
