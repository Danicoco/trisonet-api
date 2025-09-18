/** @format */

import { Request } from "express"
import { IFood, IOrder } from "../../../types"

export const composeFilter = (req: Request) => {
    const { status, admin = undefined } = req.query
    let filter = {}

    if (status) filter = { ...filter, status }
    if (!admin) {
        filter = { ...filter, user: String(req.user._id) }
    }

    return filter
}

export const composeDoc = (
    req: Request,
    foods: IFood[],
    totalPrice: number
): IOrder => {
    const items = req.body.items as [{ foodId: string; quantity: number }]

    return {
        totalPrice,
        user: String(req.user._id),
        status: "pending",
        delivery: req.body.delivery,
        items: items.map(item => {
            const prod = foods.find(food => String(food._id) === item.foodId)
            return { ...item, price: Number(prod?.price || 0) }
        }),
    }
}
