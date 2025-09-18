/** @format */

import { ISubscription } from "../../../types"
import { SubscriptionModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class SubscriptionService extends BaseRepository<ISubscription> {
    constructor(params: Partial<ISubscription> | FilterQuery<ISubscription>) {
        super(SubscriptionModel, params)
    }
}

export default SubscriptionService
