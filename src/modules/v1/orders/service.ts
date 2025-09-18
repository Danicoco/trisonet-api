/** @format */

import { IOrder } from "../../../types"
import { OrderModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class OrderService extends BaseRepository<IOrder> {
    constructor(params: Partial<IOrder> | FilterQuery<IOrder>) {
        super(OrderModel, params)
    }
}

export default OrderService
