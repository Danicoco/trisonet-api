/** @format */

import { ICommunityChat } from "../../../types"
import { CommunityChatModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class CommunityChatService extends BaseRepository<ICommunityChat> {
    constructor(params: Partial<ICommunityChat> | FilterQuery<ICommunityChat>) {
        super(CommunityChatModel, params)
    }

    public async readUnSeenMessages(community: string, userId: string, lastMessageDate: string) {
        await CommunityChatModel.updateMany(
            {
              community,
              createdAt: { $lte: lastMessageDate },
              readBy: { $ne: userId }
            },
            {
              $addToSet: { readBy: userId }
            }
          );
    }
}

export default CommunityChatService
