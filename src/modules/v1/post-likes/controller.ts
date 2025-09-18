/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import PostLikeService from "./service"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit } = req.query
    try {
        const [result, error] = await tryPromise(
            new PostLikeService({}).findAll(
                {
                    post: req.params._id
                },
                Number(page),
                Number(limit),
                [
                    { path: "user", select: "firstName lastName avatar" },
                ]
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Post Likers fetched", result))
    } catch (error) {
        next(error)
    }
}
