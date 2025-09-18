/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IFollow } from "../../types"

const FollowSchema: Schema = new Schema<IFollow>(
    {
        user: { type: "String", required: true, ref: "User" },
        following: { type: "String", required: true, ref: "User" },
        dateFollowed: { type: "Date", required: true, default: new Date() },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "follows",
    }
)

FollowSchema.set("timestamps", true)
FollowSchema.plugin(mongoosePagination)
FollowSchema.index({ "user": 1, following: 1 })

const FollowModel = db.model<IFollow, Pagination<IFollow>>(
    "Follow",
    // @ts-ignore
    FollowSchema
)

export default FollowModel
