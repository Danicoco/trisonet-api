/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPost } from "../../types"

const userSchema = new Schema({
    _id: { type: "String", required: true, ref: "User" },
    firstName: { type: "String", required: true, },
    lastName: { type: "String", required: true, },
    avatar: { type: "String", },
})

const PostSchema: Schema = new Schema<IPost>(
    {
        post: { type: "String", ref: "Post" },
        description: { type: "String", required: true },
        numberOfLikes: { type: "Number", required: true, default: 0 },
        numberOfReplies: { type: "Number", required: true, default: 0 },
        attachments: { type: ["String"], },
        user: { type: userSchema, required: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "posts",
    }
)

PostSchema.set("timestamps", true)
PostSchema.plugin(mongoosePagination)
PostSchema.index({ "user._id": 1, post: 1 })

const PostModel = db.model<IPost, Pagination<IPost>>(
    "Post",
    // @ts-ignore
    PostSchema
)

export default PostModel
