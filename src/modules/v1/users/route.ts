/** @format */

import { Router } from "express"

import {
    adminUpdateSchema,
    changePasswordSchema,
    createSchema,
    fetchSchema,
    loginSchema,
    resendCodeSchema,
    updateSchema,
    validateOTPSchema,
    verifySchema,
} from "./validation"
import {
    update,
    create,
    fetch,
    login,
    profile,
    followAndUnfollow,
    validateOTP,
    adminProfile,
} from "./controller"
import { Authenticate, validator } from "../../common/utils"
import {
    validateChangePassword,
    validateCreate,
    validateGenerateCode,
    validateResendCode,
    verifyAccount,
} from "./middleware"

const userRouter = Router({
    caseSensitive: true,
    strict: true,
})

userRouter.post("/", validator.body(createSchema), validateCreate, create)

userRouter.post(
    "/verify-account",
    validator.body(verifySchema),
    verifyAccount,
    update
)

userRouter.post(
    "/resend-code",
    validator.body(resendCodeSchema),
    validateResendCode,
    update
)

userRouter.post(
    "/generate-code",
    validator.body(resendCodeSchema),
    validateGenerateCode,
    update
)

userRouter.post(
    "/change-password",
    validator.body(changePasswordSchema),
    validateChangePassword,
    update
)

userRouter.post(
    "/validate-code",
    validator.body(validateOTPSchema),
    validateOTP
)

userRouter.post("/login", validator.body(loginSchema), login)

userRouter.put("/profile", Authenticate, validator.body(updateSchema), update)

userRouter.get("/profile", Authenticate, profile)

userRouter.get("/:id/profile", Authenticate, adminProfile)

userRouter.put(
    "/:id/profile",
    Authenticate,
    validator.body(adminUpdateSchema),
    update
)

userRouter.get("/", Authenticate, validator.body(fetchSchema), fetch)

userRouter.post("/:_id/creators", Authenticate, followAndUnfollow)

export default userRouter
