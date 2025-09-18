/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import TransactionService from "./service"
import { composeFilter } from "./helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const [transactions, error] = await tryPromise(
            new TransactionService({}).findAll(
                { ...composeFilter(req) },
                Number(page),
                Number(limit),
                [
                    { path: "user", select: 'firstName lastName' }
                ]
            )
        )

        if (error) throw catchError("Error processing request", 400)

        return res
            .status(200)
            .json(success("Transactions Retrieved", transactions))
    } catch (error) {
        next(error)
    }
}
