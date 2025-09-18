/** @format */

import { IMetaVerseProperties } from "../../../types"
import { MetaversePropertyModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class MetaversePropertyService extends BaseRepository<IMetaVerseProperties> {
    constructor(params: Partial<IMetaVerseProperties> | FilterQuery<IMetaVerseProperties>) {
        super(MetaversePropertyModel, params)
    }
}

export default MetaversePropertyService
