/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IHousing } from "../../types"

const HousingSchema: Schema = new Schema<IHousing>(
    {
        title: { type: "String", required: true },
        description: { type: "String" },
        location: { type: "String" },
        restroom: { type: "String" },
        bed: { type: "String" },
        size: { type: "String", },
        agent: { type: { name: "String", phoneNumber: "String" }, },
        attachments: { type: ["String"] },
        admin: { type: "String", required: true, ref: "Admin" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "housing",
    }
)

HousingSchema.set("timestamps", true)
HousingSchema.plugin(mongoosePagination)
HousingSchema.index({ admin: 1, title: 1 })

const HousingModel = db.model<IHousing, Pagination<IHousing>>(
    "Housing",
    // @ts-ignore
    HousingSchema
)

export default HousingModel
