/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import SubscriptionService from "./service"
import { db } from "../../../databases/connection"
import { debitWallet } from "../wallets/helper"
import { configs } from "../../common/utils/config"

export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [result, error] = await tryPromise(
            new SubscriptionService({ user: String(req.user._id) }).findOne()
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Subscription retrieved", result))
    } catch (error) {
        next(error)
    }
}

export const subscribe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let [result, error] = await tryPromise(
            new SubscriptionService({ user: String(req.user._id) }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (result?.type === "paid" && result.isActive) {
            throw catchError("You have an active subscription")
        }

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount: Number(configs.SUBSCRIPTION_FEE),
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: {
                    action: "Updated Subscription",
                    subscrption: result,
                },
                type: "main-wallet",
            })
            if (result) {
                await new SubscriptionService({ _id: result._id }).update(
                    { isActive: true, type: "paid" },
                    session
                )
            } else {
                result = await new SubscriptionService({}).create({
                    user: String(req.user._id),
                    type: "paid",
                    amountPaid: Number(configs.SUBSCRIPTION_FEE),
                    isActive: true,
                })
            }
        })
        await session.endSession()

        return res.status(200).json(success("Subscription update", result))
    } catch (error) {
        next(error)
    }
}

export const getSubscriptionFee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return res.status(200).json(success("Fee retrieved", { fee: configs.SUBSCRIPTION_FEE }))
    } catch (error) {
        next(error);
    }
}