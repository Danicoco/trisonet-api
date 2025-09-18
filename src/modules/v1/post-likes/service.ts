/** @format */

import { IPostLike } from "../../../types"
import { PostLikeModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PostLikeService extends BaseRepository<IPostLike> {
    constructor(params: Partial<IPostLike> | FilterQuery<IPostLike>) {
        super(PostLikeModel, params)
    }
}

export default PostLikeService
