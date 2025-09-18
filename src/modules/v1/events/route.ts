/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, update } from "./controller"
import { createSchema, fetchSchema, updateSchema } from "./validation"
import { validateCreate, validateUpdate } from "./middleware"

const eventRouter = Router({
    caseSensitive: true,
    strict: true,
})

eventRouter.get("/", validator.query(fetchSchema), fetch)
eventRouter.post("/", validator.body(createSchema), validateCreate, create)
eventRouter.patch("/:_id", validator.body(updateSchema), validateUpdate, update)

export default eventRouter
