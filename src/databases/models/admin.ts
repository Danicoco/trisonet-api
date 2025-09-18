/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IAdmin } from "../../types"

const AdminSchema: Schema = new Schema<IAdmin>(
    {
        name: { type: "String", required: true },
        email: { type: "String", required: true },
        role: { type: "String", default: "super-admin" },
        password: { type: "String", required: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "admins",
    }
)

AdminSchema.set("timestamps", true)
AdminSchema.plugin(mongoosePagination)
AdminSchema.index({ email: 1 })

const AdminModel = db.model<IAdmin, Pagination<IAdmin>>(
    "Admin",
    // @ts-ignore
    AdminSchema
)

export default AdminModel
