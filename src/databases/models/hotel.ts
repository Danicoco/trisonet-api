/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IHotel } from "../../types"

const HotelSchema: Schema = new Schema<IHotel>(
    {
        name: { type: "String", required: true },
        amount: { type: "Number", required: true },
        totalAmount: { type: "Number", required: true },
        duration: { type: "Number", required: true },
        startDate: { type: "Date", default: true },
        endDate: { type: "Date", default: true },
        paid: { type: "Boolean" },
        user: { type: "String", ref: "User", required: true },
        meta: { type: "Map" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "hotels",
    }
)

HotelSchema.set("timestamps", true)
HotelSchema.plugin(mongoosePagination)
HotelSchema.index({ user: 1, name: 1 })

const HotelModel = db.model<IHotel, Pagination<IHotel>>(
    "Hotel",
    // @ts-ignore
    HotelSchema
)

export default HotelModel
