/** @format */

import { IMetaVerseEvent } from "../../../types"
import { MetaverseEventModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class MetaverseEventService extends BaseRepository<IMetaVerseEvent> {
    constructor(params: Partial<IMetaVerseEvent> | FilterQuery<IMetaVerseEvent>) {
        super(MetaverseEventModel, params)
    }
}

export default MetaverseEventService
