/** @format */

import { IEvent } from "../../../types"
import { EventModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class EventService extends BaseRepository<IEvent> {
    constructor(params: Partial<IEvent> | FilterQuery<IEvent>) {
        super(EventModel, params)
    }
}

export default EventService
