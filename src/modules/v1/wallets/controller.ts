/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import { creditWallet, debitWallet, getWallet } from "./helper"
import { db } from "../../../databases/connection"
import PinService from "../pins/service"


export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params
    try {
        if (!["main-wallet", "coin-wallet"].includes(type)) {
            throw catchError("Invalid Wallet Type")
        }
        const [result, error] = await tryPromise(
            getWallet(
                String(req.user._id),
                `${req.user.firstName} ${req.user.lastName}`,
                type as "main-wallet" | "coin-wallet"
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Wallet fetched", result))
    } catch (error) {
        next(error)
    }
}

export const convert = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { amount } = req.body
    try {
        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                type: "coin-wallet",
                session,
                amount: Number(amount),
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: {
                    amount,
                    action: "Convert from coin wallet",
                    dateConverted: new Date(),
                },
            })
            await creditWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount: Number(amount) * 5000,
                pendingTransaction: false,
                transactionMeta: {
                    amount,
                    action: "Add fund from coin wallet",
                    dateConverted: new Date(),
                },
                type: "main-wallet",
            })
        })
        await session.endSession()

        return res.status(200).json(success("Wallet converted", {}))
    } catch (error) {
        next(error)
    }
}

export const withdraw = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // bankCode, accountNumber 
    const { pin, amount, } = req.body
    try {
        const [pins, err] = await tryPromise(
            new PinService({ user: req.user._id, code: pin }).findOne()
        )
        if (err) throw catchError("Error processing your request")
        if (!pins) throw catchError("Please add pin to withdraw")

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount,
                isWithdrawal: true,
                pendingTransaction: true,
                transactionMeta: { ...req.body, withdrawalDate: new Date() },
                type: "main-wallet",
            })
        })
        await session.endSession();

        // use AGENDA TO SEND
        return res.status(200).json(
            success("Withdrawal processed", {})
        )
    } catch (error) {
        next(error)
    }
}

export const deposit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { amount, type = "main-wallet", userId } = req.body
    try {
        const session = await db.startSession()
        await session.withTransaction(async () => {
            await creditWallet({
                userId: String(userId),
                name: `Trisonet Admin`,
                session,
                amount,
                pendingTransaction: false,
                transactionMeta: { ...req.body, depositDate: new Date(), depositBy: req.admin._id },
                type,
            })
        })
        await session.endSession();

        return res.status(200).json(
            success("Withdrawal processed", {})
        )
    } catch (error) {
        next(error)
    }
}
