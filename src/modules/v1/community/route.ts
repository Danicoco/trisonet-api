/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, update } from "./controller"
import { createSchema, fetchSchema, updateSchema } from "./validation"
import { validateCreate, validateUpdate } from "./middleware"

const communityRouter = Router({
    caseSensitive: true,
    strict: true,
})

communityRouter.get("/", validator.query(fetchSchema), fetch)
communityRouter.post("/", validator.body(createSchema), validateCreate, create)
communityRouter.patch("/:_id", validator.body(updateSchema), validateUpdate, update)

export default communityRouter
