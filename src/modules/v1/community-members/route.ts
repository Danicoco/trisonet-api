/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { create, fetch, remove } from "./controller"
import { createSchema, fetchSchema, removeSchema } from "./validation"

const communityMemberRouter = Router({
    caseSensitive: true,
    strict: true,
})

communityMemberRouter.get("/", validator.query(fetchSchema), fetch)
communityMemberRouter.post("/", validator.body(createSchema), create)
communityMemberRouter.delete("/", validator.body(removeSchema), remove)

export default communityMemberRouter
