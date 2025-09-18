/** @format */

import { Router } from "express"
import { validator } from "../../common/utils"
import { create, dashboard, fetch, login, update } from "./controller"
import { createSchema, fetchSchema, loginSchema, updateSchema } from "./validation"

const adminRouter = Router({
    caseSensitive: true,
    strict: true,
})

adminRouter.post("/", validator.body(createSchema), create)
adminRouter.patch("/:_id", validator.body(updateSchema), update)
adminRouter.post("/login", validator.body(loginSchema), login)
adminRouter.get("/", validator.query(fetchSchema), fetch)
adminRouter.get("/dashboard", dashboard)

export default adminRouter
