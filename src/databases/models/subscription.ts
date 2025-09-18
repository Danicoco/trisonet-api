/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ISubscription } from "../../types"

const SubscriptionSchema: Schema = new Schema<ISubscription>(
    {
        type: { type: "String", required: true },
        amountPaid: { type: "Number", default: 0 },
        lastSubscriptionDate: { type: "Date" },
        isActive: { type: "Boolean", default: true, required: true },
        user: { type: "String", required: true, ref: "User" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "subscriptions",
    }
)

SubscriptionSchema.set("timestamps", true)
SubscriptionSchema.plugin(mongoosePagination)
SubscriptionSchema.index({ user: 1 })

const SubscriptionModel = db.model<ISubscription, Pagination<ISubscription>>(
    "Subscription",
    // @ts-ignore
    SubscriptionSchema
)

export default SubscriptionModel
