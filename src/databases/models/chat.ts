/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IChat } from "../../types"

const ChatSchema: Schema = new Schema<IChat>(
    {
        roomId: { type: "String", required: true },
        sender: { type: "String", ref: "User" },
        message: { type: "String" },
        replyTo: { type: "String", ref: "Chat" },
        receiver: { type: "String", ref: "User" },
        delievered: { type: "Boolean", default: false },
        seen: { type: "Boolean", default: false },
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
        collection: "chats",
    }
)

ChatSchema.set("timestamps", true)
ChatSchema.plugin(mongoosePagination)
ChatSchema.index({ sender: 1, receiver: 1, roomId: 1 })

const ChatModel = db.model<IChat, Pagination<IChat>>(
    "Chat",
    // @ts-ignore
    ChatSchema
)

export default ChatModel
