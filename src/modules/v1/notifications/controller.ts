/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import NotificationService from "./service"

/** USE AGGREGATION AND GROUP ALL SECTION BASED BY POST */
export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit, section } = req.query
    try {
        const [result, error] = await tryPromise(
            new NotificationService({}).findAll(
                {
                    user: String(req.user._id),
                    ...(section && { section })
                },
                Number(page),
                Number(limit),
                [
                    { path: "user", select: "firstName lastName avatar" },
                    { path: "createdBy", select: "firstName lastName avatar" },
                ]
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Notificationers fetched", result))
    } catch (error) {
        next(error)
    }
}
