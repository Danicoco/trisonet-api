/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IMetaVerseEvent } from "../../types"

const Participant = new Schema(
    {
        _id: { type: "String" },
        name: { type: "String" },
    }
)

const MetaVerseEventSchema: Schema = new Schema<IMetaVerseEvent>(
    {
        metaverse: { type: "String", required: true, ref: "Metaverse" },
        amount: { type: "Number", required: true, default: 0 },
        title: { type: "String", required: true },
        description: { type: "String", required: true },
        isActive: { type: "Boolean", required: true, default: true },
        participant: { type: [Participant] },
        user: { type: "String", ref: "user", required: true },
        location: { type: "String", },
        invitationCode: { type: "String", },
        startDate: { type: "Date", required: true },
        endDate: { type: "Date", ref: "user", required: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "metaVerse-events",
    }
)

MetaVerseEventSchema.set("timestamps", true)
MetaVerseEventSchema.plugin(mongoosePagination)
MetaVerseEventSchema.index({ user: 1 })

const MetaVerseEventModel = db.model<IMetaVerseEvent, Pagination<IMetaVerseEvent>>(
    "MetaVerseEvent",
    // @ts-ignore
    MetaVerseEventSchema
)

export default MetaVerseEventModel
