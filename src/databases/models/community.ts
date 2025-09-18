/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ICommunity } from "../../types"

const CommunitySchema: Schema = new Schema<ICommunity>(
    {
        name: { type: "String", required: true },
        description: { type: "String" },
        avatar: { type: "String" },
        inviteLink: { type: "String" },
        privacy: { type: "String", enum: ["public", "private"] },
        user: { type: "String", required: true, ref: "User" },
        numberOfParticipant: { type: "Number", required: true, default: 0 },
        lastMessage: { type: "String" },
        dateOfLastMessage: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "communities",
    }
)

CommunitySchema.set("timestamps", true)
CommunitySchema.plugin(mongoosePagination)
CommunitySchema.index({ user: 1, name: 1 })

const CommunityModel = db.model<ICommunity, Pagination<ICommunity>>(
    "Community",
    // @ts-ignore
    CommunitySchema
)

export default CommunityModel
