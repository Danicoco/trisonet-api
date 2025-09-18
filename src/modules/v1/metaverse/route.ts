/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, get, update } from "./controller"
import { createSchema, fetchSchema, updateSchema } from "./validation"
import { validateCreate, validateUpdate } from "./middleware"

const metaverseRouter = Router({
    caseSensitive: true,
    strict: true,
})

metaverseRouter.get("/data", get)
metaverseRouter.get("/", validator.query(fetchSchema), fetch)
metaverseRouter.post("/", validator.body(createSchema), validateCreate, create)
metaverseRouter.patch("/", validator.body(updateSchema), validateUpdate, update)

export default metaverseRouter
