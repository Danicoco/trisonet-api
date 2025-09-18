/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { INotification } from "../../types"

const NotificationSchema: Schema = new Schema<INotification>(
    {
        user: { type: "String", required: true, ref: "User" },
        createdBy: { type: "String", required: true, ref: "User" },
        action: { type: "String", required: true },
        post: { type: "String", ref: "Post" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "notifications",
    }
)

NotificationSchema.set("timestamps", true)
NotificationSchema.plugin(mongoosePagination)
NotificationSchema.index({ user: 1, createdBy: 1 })

const NotificationModel = db.model<INotification, Pagination<INotification>>(
    "Notification",
    // @ts-ignore
    NotificationSchema
)

export default NotificationModel
