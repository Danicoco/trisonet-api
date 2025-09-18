/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPin } from "../../types"

const PinSchema: Schema = new Schema<IPin>(
    {
        code: { type: "String", required: true },
        attemptLeft: { type: "Number", default: 3 },
        lastChangedAt: { type: "Date" },
        user: { type: "String", required: true, ref: "User" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "pins",
    }
)

PinSchema.set("timestamps", true)
PinSchema.plugin(mongoosePagination)
PinSchema.index({ user: 1 })

const PinModel = db.model<IPin, Pagination<IPin>>(
    "Pin",
    // @ts-ignore
    PinSchema
)

export default PinModel
