/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch } from "./controller"
import { createSchema, fetchSchema } from "./validation"

const orderRouter = Router({
    caseSensitive: true,
    strict: true,
})

orderRouter.get("/", validator.query(fetchSchema), fetch)
orderRouter.post("/", validator.body(createSchema), create)

export default orderRouter
