/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { fetch } from "./controller"
import { fetchSchema } from "./validation"

const notificationRouter = Router({
    caseSensitive: true,
    strict: true,
})

notificationRouter.get("/", validator.query(fetchSchema), fetch)

export default notificationRouter
