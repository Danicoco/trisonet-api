/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IMetaVerseAsset } from "../../types"

const MetaVerseAssetSchema: Schema = new Schema<IMetaVerseAsset>(
    {
        name: { type: "String", required: true },
        price: { type: "Number", required: true, default: 0 },
        uniqueName: { type: "String", required: true },
        type: { type: "String" },
        meta: { type: "Map" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "metaverse-assets",
    }
)

MetaVerseAssetSchema.set("timestamps", true)
MetaVerseAssetSchema.plugin(mongoosePagination)
MetaVerseAssetSchema.index({ user: 1 })

const MetaVerseAssetModel = db.model<IMetaVerseAsset, Pagination<IMetaVerseAsset>>(
    "MetaVerseAsset",
    // @ts-ignore
    MetaVerseAssetSchema
)

export default MetaVerseAssetModel