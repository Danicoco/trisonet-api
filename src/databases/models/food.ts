/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IFood } from "../../types"

const FoodSchema: Schema = new Schema<IFood>(
    {
        title: { type: "String", required: true },
        description: { type: "String" },
        price: { type: "Number" },
        categories: { type: ["String"] },
        quantity: { type: "Number", },
        attachment: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "foods",
    }
)

FoodSchema.set("timestamps", true)
FoodSchema.plugin(mongoosePagination)
FoodSchema.index({ categories: 1, title: 1 })

const FoodModel = db.model<IFood, Pagination<IFood>>(
    "Food",
    // @ts-ignore
    FoodSchema
)

export default FoodModel
