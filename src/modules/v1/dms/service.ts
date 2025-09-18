/** @format */

import { IDM } from "../../../types"
import { DmModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class DMService extends BaseRepository<IDM> {
    constructor(params: Partial<IDM> | FilterQuery<IDM>) {
        super(DmModel, params)
    }
}

export default DMService
