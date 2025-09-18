/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { ICommunityMember } from "../../types"

const CommunityMemberSchema: Schema = new Schema<ICommunityMember>(
    {
        user: { type: "String", required: true, ref: "User" },
        community: { type: "String", required: true, ref: "Community" },
        status: { type: "String", default: 'member' },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "community-members",
    }
)

CommunityMemberSchema.set("timestamps", true)
CommunityMemberSchema.plugin(mongoosePagination)
CommunityMemberSchema.index({ user: 1, community: 1 })

const CommunityMemberModel = db.model<ICommunityMember, Pagination<ICommunityMember>>(
    "CommunityMember",
    // @ts-ignore
    CommunityMemberSchema
)

export default CommunityMemberModel
