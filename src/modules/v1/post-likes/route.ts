/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import { fetch } from "./controller"
import { fetchSchema } from "./validation"

const postLikeRouter = Router({
    caseSensitive: true,
    strict: true,
})

postLikeRouter.get("/", validator.query(fetchSchema), fetch)

export default postLikeRouter
