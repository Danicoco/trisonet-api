/** @format */

import { NextFunction, Request, Response } from "express"

import AdminService from "./service"
import { catchError, success, tryPromise } from "../../common/utils"
import { decrytData, encryptData } from "../../common/hashings"
import { addHours } from "date-fns"
import WalletService from "../wallets/service"
import UserService from "../users/service"
import SubscriptionService from "../subscriptions/service"
import ChatService from "../chats/service"
import CommunityChatService from "../community-chats/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body
    try {
        const [admin, err] = await tryPromise(
            new AdminService({ email }).findOne()
        )

        if (err) throw catchError("Error processing request")
        if (admin) throw catchError("Admin already exist", 400)

        const result = await new AdminService({}).create({
            ...req.body,
            password: encryptData(password),
        })

        return res.status(200).json(success("Admin created", result))
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password } = req.body
    try {
        const [admin, err] = await tryPromise(
            new AdminService({ _id: req.params._id }).findOne()
        )

        if (err) throw catchError("Error processing request")
        if (!admin) throw catchError("Invalid account", 400)

        const result = await new AdminService({ _id: admin._id }).update({
            ...req.body,
            password: encryptData(password),
        })

        return res.status(200).json(success("Admin updated", result))
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body
    try {
        const [admin, err] = await tryPromise(
            new AdminService({ email }).findOne()
        )

        if (err) throw catchError("Error processing request")
        if (!admin) throw catchError("Email/Password is incorrect", 400)

        if (decrytData(admin.password) !== password) {
            throw catchError("Email/Password is incorrect", 400)
        }

        const token = encryptData(
            JSON.stringify({
                _id: admin._id,
                exp: addHours(new Date(), 18),
                isAdmin: true,
            })
        )

        return res.status(200).json(success("Admin updated", {}, { token }))
    } catch (error) {
        next(error)
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit } = req.query
    try {
        const [result, error] = await tryPromise(
            new AdminService({}).findAll({}, Number(page), Number(limit))
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Admins fetched", result))
    } catch (error) {
        next(error)
    }
}

export const dashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$type",
                    fieldN: {
                        $sum: "$balance",
                    },
                },
            },
        ]
        const [
            balance,
            totalUser,
            totalSubscribers,
            totalChat,
            totalCommunityChat,
        ] = await Promise.all([
            new WalletService({}).aggregate(pipeline),
            new UserService({}).count(),
            new SubscriptionService({ isActive: true }).count(),
            new ChatService({}).count(),
            new CommunityChatService({}).count(),
        ])

        return res
            .status(200)
            .json(
                success("Application Balance", {
                    balance,
                    totalUser,
                    totalSubscribers,
                    totalChat,
                    totalCommunityChat,
                })
            )
    } catch (error) {
        next(error)
    }
}
