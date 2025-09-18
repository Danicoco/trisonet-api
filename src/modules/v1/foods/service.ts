/** @format */

import { IFood } from "../../../types"
import { FoodModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class FoodService extends BaseRepository<IFood> {
    constructor(params: Partial<IFood> | FilterQuery<IFood>) {
        super(FoodModel, params)
    }
}

export default FoodService
