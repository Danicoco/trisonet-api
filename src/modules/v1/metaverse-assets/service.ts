/** @format */

import { IMetaVerseAsset } from "../../../types"
import { MetaverseAssetModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class MetaVerseAssetService extends BaseRepository<IMetaVerseAsset> {
    constructor(params: Partial<IMetaVerseAsset> | FilterQuery<IMetaVerseAsset>) {
        super(MetaverseAssetModel, params)
    }
}

export default MetaVerseAssetService
