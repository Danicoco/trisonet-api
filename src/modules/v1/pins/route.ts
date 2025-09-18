/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, get, update } from "./controller"
import { createSchema, updateSchema } from "./validation"

const pinRouter = Router({
    caseSensitive: true,
    strict: true,
})

pinRouter.post("/", validator.body(createSchema), create)
pinRouter.get("/", get)
pinRouter.patch("/", validator.body(updateSchema), update)

export default pinRouter
