/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IMetaVerseProperties } from "../../types"

const MetaVersePropertiesSchema: Schema = new Schema<IMetaVerseProperties>(
    {
        type: { type: "String", required: true },
        price: { type: "Number", required: true },
        dateAcquired: { type: "Date", required: true },
        forSale: { type: "Boolean", default: false },
        sold: { type: "Boolean" },
        dateSold: { type: "Date",  },
        isActive: { type: "Boolean", required: true, default: true },
        metaverse: { type: "String", ref: 'Metaverse' },
        user: { type: "String", ref: "User" },
        admin: { type: "String", ref: "Admin" },
        meta: { type: "Map" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "metaVerse-properties",
    }
)

MetaVersePropertiesSchema.set("timestamps", true)
MetaVersePropertiesSchema.plugin(mongoosePagination)
MetaVersePropertiesSchema.index({ user: 1, metaverse: 1 })

const MetaVersePropertiesModel = db.model<IMetaVerseProperties, Pagination<IMetaVerseProperties>>(
    "MetaVerseProperties",
    // @ts-ignore
    MetaVersePropertiesSchema
)

export default MetaVersePropertiesModel
