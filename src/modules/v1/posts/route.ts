/** @format */

import { Router } from "express"

import { createSchema } from "./validation"
import { validator } from "../../common/utils"
import { create, fetch, get, like, reply } from "./controller"

const postRouter = Router({
    caseSensitive: true,
    strict: true,
})

postRouter.post("/", validator.body(createSchema), create)

postRouter.post("/:_id/reply", validator.body(createSchema), reply)

postRouter.patch("/:_id/like", like)

postRouter.get("/:_id", get)

postRouter.get("/", fetch)

export default postRouter
