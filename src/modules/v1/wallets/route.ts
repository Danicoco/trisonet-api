/** @format */

import { Router } from "express"

import { convert, deposit, get, withdraw } from "./controller"
import { validator } from "../../common/utils"
import { convertSchema } from "./validation"

const walletRouter = Router({
    caseSensitive: true,
    strict: true,
})

walletRouter.post("/convert/qt", validator.body(convertSchema), convert)
walletRouter.get("/:type", get)
walletRouter.post("/withdaw", withdraw)
walletRouter.post("/deposit", deposit)

export default walletRouter
