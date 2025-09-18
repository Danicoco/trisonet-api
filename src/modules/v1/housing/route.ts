/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, update } from "./controller"
import { createSchema, fetchSchema, updateSchema } from "./validation"
import { validateCreate, validateUpdate } from "./middleware"

const housingRouter = Router({
    caseSensitive: true,
    strict: true,
})

housingRouter.get("/", validator.query(fetchSchema), fetch)
housingRouter.post("/", validator.body(createSchema), validateCreate, create)
housingRouter.patch("/:_id", validator.body(updateSchema), validateUpdate, update)

export default housingRouter
