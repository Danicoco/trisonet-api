/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ISettlement } from "../../types"

const SettlementSchema: Schema = new Schema<ISettlement>(
    {
        type: { type: "String", required: true },
        meta: { type: "Map", },
        status: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "settlements",
    }
)

SettlementSchema.set("timestamps", true)
SettlementSchema.plugin(mongoosePagination)

const SettlementModel = db.model<ISettlement, Pagination<ISettlement>>(
    "Settlement",
    // @ts-ignore
    SettlementSchema
)

export default SettlementModel
