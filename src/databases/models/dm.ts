/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IDM } from "../../types"

const DMSchema: Schema = new Schema<IDM>(
    {
        user: { type: "String", required: true, ref: "User" },
        sender: { type: "String", required: true, ref: "User" },
        lastMessage: { type: "String", required: true },
        roomId: { type: "String" },
        unread: { 
            sender: { type: "Number" },
            user: { type: "Number" },
         },
        dateOfLastMessage: {
            type: "Date",
            required: true,
            default: new Date(),
        },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "dms",
    }
)

DMSchema.set("timestamps", true)
DMSchema.plugin(mongoosePagination)
DMSchema.index({ user: 1, sender: 1 })

const DMModel = db.model<IDM, Pagination<IDM>>(
    "DM",
    // @ts-ignore
    DMSchema
)

export default DMModel
