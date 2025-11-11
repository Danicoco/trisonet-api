/** @format */

import { IHotel } from "../../../types"
import { HotelModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class HotelService extends BaseRepository<IHotel> {
    constructor(params: Partial<IHotel> | FilterQuery<IHotel>) {
        super(HotelModel, params)
    }
}

export default HotelService
