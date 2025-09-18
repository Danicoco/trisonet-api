/** @format */

import { IMetaverse } from "../../../types"
import { MetaverseModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class MetaverseService extends BaseRepository<IMetaverse> {
    constructor(params: Partial<IMetaverse> | FilterQuery<IMetaverse>) {
        super(MetaverseModel, params)
    }
}

export default MetaverseService
