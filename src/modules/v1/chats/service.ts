/** @format */

import { IChat } from "../../../types"
import { ChatModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class ChatService extends BaseRepository<IChat> {
    constructor(params: Partial<IChat> | FilterQuery<IChat>) {
        super(ChatModel, params)
    }
}

export default ChatService
