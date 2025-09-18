/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import CommunityService from "./service"
import SubscriptionService from "../subscriptions/service"


export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, privacy } = req.body
    try {
        const [community, error] = await tryPromise(
            new CommunityService({
                name
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (community) throw catchError("Community with this name already exist. Use another name", 400)

        if (privacy === "private") {
            const subscription = await tryPromise(
                new SubscriptionService({ user: String(req.user._id), isActive: true }).findOne()
            )

            if (!subscription) throw catchError("Only premium users can create private community. Please subscribe");
        }

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
        const [community, error] = await tryPromise(
            new CommunityService({
                _id
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!community) throw catchError("Community does not exist", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
