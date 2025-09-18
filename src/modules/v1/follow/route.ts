/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { fetch } from "./controller"
import { fetchSchema } from "./validation"

const followRouter = Router({
    caseSensitive: true,
    strict: true,
})

followRouter.get("/", validator.query(fetchSchema), fetch)

export default followRouter
