/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IEvent } from "../../types"

const EventSchema: Schema = new Schema<IEvent>(
    {
        title: { type: "String", required: true },
        description: { type: "String" },
        location: { type: "String" },
        date: { type: "Date" },
        amount: { type: "Number", },
        attachments: { type: ["String"] },
        admin: { type: "String", required: true, ref: "Admin" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "events",
    }
)

EventSchema.set("timestamps", true)
EventSchema.plugin(mongoosePagination)
EventSchema.index({ admin: 1, title: 1 })

const EventModel = db.model<IEvent, Pagination<IEvent>>(
    "Event",
    // @ts-ignore
    EventSchema
)

export default EventModel
