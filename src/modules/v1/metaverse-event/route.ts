/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, registerForEvent, update } from "./controller"
import { createSchema, fetchSchema } from "./validation"
import { validateUpdate } from "./middleware"

const metaverseEventRouter = Router({
    caseSensitive: true,
    strict: true,
})

metaverseEventRouter.get("/", validator.query(fetchSchema), fetch)
metaverseEventRouter.post("/", validator.body(createSchema), create)
metaverseEventRouter.post("/register/:_id", registerForEvent)
metaverseEventRouter.patch("/:_id", validator.body(createSchema), validateUpdate, update)

export default metaverseEventRouter
