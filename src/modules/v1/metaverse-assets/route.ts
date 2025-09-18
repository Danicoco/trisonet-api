/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, update } from "./controller"
import { createSchema, fetchSchema } from "./validation"
import { validateUpdate } from "./middleware"

const metaverseAssetRouter = Router({
    caseSensitive: true,
    strict: true,
})

metaverseAssetRouter.get("/", validator.query(fetchSchema), fetch)
metaverseAssetRouter.post("/", validator.body(createSchema), create)
metaverseAssetRouter.put("/:_id", validator.body(createSchema), validateUpdate, update)

export default metaverseAssetRouter
