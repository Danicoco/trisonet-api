/** @format */

import { ICommunity } from "../../../types"
import { CommunityModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class CommunityService extends BaseRepository<ICommunity> {
    constructor(params: Partial<ICommunity> | FilterQuery<ICommunity>) {
        super(CommunityModel, params)
    }
}

export default CommunityService
