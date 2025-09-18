/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPostLike } from "../../types"

const PostLikeSchema: Schema = new Schema<IPostLike>(
    {
        user: { type: "String", required: true, ref: "User" },
        postCreator: { type: "String", required: true, ref: "User" },
        post: { type: "String", required: true, ref: "Post" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "postLikes",
    }
)

PostLikeSchema.set("timestamps", true)
PostLikeSchema.plugin(mongoosePagination)
PostLikeSchema.index({ user: 1, postCreator: 1 })

const PostLikeModel = db.model<IPostLike, Pagination<IPostLike>>(
    "PostLike",
    // @ts-ignore
    PostLikeSchema
)

export default PostLikeModel
