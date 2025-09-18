/** @format */

import { Router } from "express"
import { validator } from "../../common/utils"
import { fetch } from "./controller"
import { fetchSchema } from "./validation"

const dmRouter = Router({
    caseSensitive: true,
    strict: true,
})

dmRouter.get("/", validator.query(fetchSchema), fetch)

export default dmRouter
