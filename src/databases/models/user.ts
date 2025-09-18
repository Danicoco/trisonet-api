/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IUser } from "../../types"


const UserSchema: Schema = new Schema<IUser>(
    {
        firstName: { type: "String", required: true },
        lastName: { type: "String", required: true },
        email: { type: "String", required: true },
        phoneNumber: { type: "String", required: true, unique: true },
        password: { type: "String", required: true },
        verifiedAt: { type: "Date", },
        isActive: { type: "Boolean", default: true },
        otp: { type: "String" },
        pim: { type: "String" },
        nin: { type: "String" },
        avatar: { type: "String" },
        delivery: { type: { address: "String", phoneNumber: "String" } },
        dateOfBirth: { type: "Date", required: true },
        numberOfFollowers: { type: "Number", default: 0 },
        numberOfFollowing: { type: "Number", default: 0 },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "users",
    }
)

UserSchema.set("timestamps", true)
UserSchema.plugin(mongoosePagination)
UserSchema.index({ "email": 1, phoneNumber: 1 })

const UserModel = db.model<IUser, Pagination<IUser>>(
    "User",
    // @ts-ignore
    UserSchema
)

export default UserModel
