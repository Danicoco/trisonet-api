/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { buy, create, develop, fetch, forSale, update } from "./controller"
import { createSchema, fetchSchema } from "./validation"
import { validateUpdate } from "./middleware"

const metaversePropertyRouter = Router({
    caseSensitive: true,
    strict: true,
})

metaversePropertyRouter.get("/", validator.query(fetchSchema), fetch)
metaversePropertyRouter.post("/", validator.body(createSchema), create)
metaversePropertyRouter.put("/:_id", validator.body(createSchema), validateUpdate, update)
metaversePropertyRouter.patch("/:_id/for-sale", validateUpdate, forSale)
metaversePropertyRouter.patch("/:_id/buy", buy)
metaversePropertyRouter.patch("/:_id/develop-building", develop)

export default metaversePropertyRouter
