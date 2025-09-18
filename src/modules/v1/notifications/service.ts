/** @format */

import { INotification } from "../../../types"
import { NotificationModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class NotificationService extends BaseRepository<INotification> {
    constructor(params: Partial<INotification> | FilterQuery<INotification>) {
        super(NotificationModel, params)
    }
}

export default NotificationService
