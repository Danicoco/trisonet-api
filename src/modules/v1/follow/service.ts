/** @format */

import { IFollow } from "../../../types"
import { FollowModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class FollowService extends BaseRepository<IFollow> {
    constructor(params: Partial<IFollow> | FilterQuery<IFollow>) {
        super(FollowModel, params)
    }
}

export default FollowService
