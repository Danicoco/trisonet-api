/** @format */

import { ICommunityMember } from "../../../types"
import { CommunityMemberModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class CommunityMemberService extends BaseRepository<ICommunityMember> {
    constructor(params: Partial<ICommunityMember> | FilterQuery<ICommunityMember>) {
        super(CommunityMemberModel, params)
    }
}

export default CommunityMemberService
