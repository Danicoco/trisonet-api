/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, getCategories, update } from "./controller"
import { createSchema, fetchSchema, updateSchema } from "./validation"
import { validateCreate, validateUpdate } from "./middleware"

const foodRouter = Router({
    caseSensitive: true,
    strict: true,
})

foodRouter.get("/", validator.query(fetchSchema), fetch)
foodRouter.get("/categories", getCategories)
foodRouter.post("/", validator.body(createSchema), validateCreate, create)
foodRouter.patch("/:_id", validator.body(updateSchema), validateUpdate, update)

export default foodRouter
