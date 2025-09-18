/** @format */

import { IPost } from "../../../types"
import { PostModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PostService extends BaseRepository<IPost> {
    constructor(params: Partial<IPost> | FilterQuery<IPost>) {
        super(PostModel, params)
    }
}

export default PostService
