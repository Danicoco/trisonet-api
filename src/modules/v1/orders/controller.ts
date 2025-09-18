/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import OrderService from "./service"
import { composeDoc, composeFilter } from "./helper"
import FoodService from "../foods/service"
import { db } from "../../../databases/connection"
import { debitWallet } from "../wallets/helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const [result, error] = await tryPromise(
            new OrderService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Orders fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const items = req.body.items as [{ foodId: string; quantity: number }]
    try {
        const foodIds = items.map(item => item.foodId)
        const foods = await new FoodService({}).findAll({
            _id: { $in: foodIds },
        })
        if (foods?.docs.length !== foodIds.length)
            throw catchError("One or more items are not available")
        const hasZeroQuantity = items.filter(item => item.quantity === 0)
        if (hasZeroQuantity.length)
            throw catchError(`One or more items has zero quantity`, 400)

        let totalPrice = 0

        foods.docs.forEach(doc => {
            const hasFood = items.find(item => item.foodId === String(doc._id))
            const price = Number(hasFood?.quantity) * Number(doc.price)
            totalPrice += price
        })

        if (totalPrice === 0) throw catchError("Something went wrong")

        const doc = composeDoc(req, foods.docs || [], totalPrice)

        const session = await db.startSession()
        await session.withTransaction(async () => {
            const order = await new OrderService({}).create(doc, session)
            await debitWallet({
                session,
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                amount: totalPrice,
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: { orderId: order._id },
                type: "main-wallet",
            })
        })
        await session.endSession()

        return res.status(200).json(success("Order created", {}))
    } catch (error) {
        next(error)
    }
}

