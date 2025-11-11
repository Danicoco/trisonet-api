import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch } from "./controller"
import { createSchema, fetchSchema } from "./validation"

const hotelRouter = Router({
    caseSensitive: true,
    strict: true,
})

hotelRouter.post("/", validator.body(createSchema), create)
hotelRouter.get("/", validator.query(fetchSchema), fetch)

export default hotelRouter;