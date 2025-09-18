/** @format */

import { IHousing } from "../../../types"
import { HousingModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class HousingService extends BaseRepository<IHousing> {
    constructor(params: Partial<IHousing> | FilterQuery<IHousing>) {
        super(HousingModel, params)
    }
}

export default HousingService
