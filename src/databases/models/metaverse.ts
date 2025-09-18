/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IMetaverse } from "../../types"

const MetaverseSchema: Schema = new Schema<IMetaverse>(
    {
        avatar: { type: "String", required: true },
        user: { type: "String", ref: "user", required: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "metaverse",
    }
)

MetaverseSchema.set("timestamps", true)
MetaverseSchema.plugin(mongoosePagination)
MetaverseSchema.index({ user: 1 })

const MetaverseModel = db.model<IMetaverse, Pagination<IMetaverse>>(
    "Metaverse",
    // @ts-ignore
    MetaverseSchema
)

export default MetaverseModel
