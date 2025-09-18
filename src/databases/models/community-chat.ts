/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ICommunityChat } from "../../types"

const CommunityChatSchema: Schema = new Schema<ICommunityChat>(
    {
        roomId: { type: "String", required: true },
        sender: { type: "String", ref: "User" },
        message: { type: "String" },
        readBy: { type: ["String"] },
        replyTo: { type: "String", ref: "CommunityChat" },
        community: { type: "String", ref: "Community" },
        removed: {
            type: {
                date: "Date",
                deleteBy: { _id: "String", name: "String" },
            },
        },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "community-chats",
    }
)

CommunityChatSchema.set("timestamps", true)
CommunityChatSchema.plugin(mongoosePagination)
CommunityChatSchema.index({ sender: 1, community: 1, roomId: 1 })

const CommunityChatModel = db.model<ICommunityChat, Pagination<ICommunityChat>>(
    "CommunityChat",
    // @ts-ignore
    CommunityChatSchema
)

export default CommunityChatModel
