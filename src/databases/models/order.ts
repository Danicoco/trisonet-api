/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IOrder } from "../../types"

const OrderSchema: Schema = new Schema<IOrder>(
    {
        user: { type: "String", required: true, ref: 'User' },
        totalPrice: { type: "Number" },
        status: { type: "String" },
        delivery: { type: { address: "String", phoneNumber: "String" } },
        items: { type: [{ foodId: "String", quantity: "Number", price: "Number" }] },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "orders",
    }
)

OrderSchema.set("timestamps", true)
OrderSchema.plugin(mongoosePagination)
OrderSchema.index({ admin: 1, title: 1 })

const OrderModel = db.model<IOrder, Pagination<IOrder>>(
    "Order",
    // @ts-ignore
    OrderSchema
)

export default OrderModel
