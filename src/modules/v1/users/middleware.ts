/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import UserService from "./service"
import { randomInt } from "crypto"
import { addMinutes, isAfter } from "date-fns"
import { encryptData } from "../../common/hashings"
import Termii from "../../thirdpartyApi/termii"
import Email from "../../thirdpartyApi/zeptomail"

export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                $or: [{ phoneNumber }, { email }],
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user) throw catchError("Account already exist. Kindly login", 400)

        // validate promo

        return next()
    } catch (error) {
        next(error)
    }
}

export const verifyAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, otp } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user.verifiedAt)
            throw catchError("Your account has been verified. Proceed to login")
        // if (configs.NODE_ENV === "production") {
        if (
            isAfter(
                new Date(),
                addMinutes(new Date(String(user.updatedAt)), 10)
            )
        )
            throw catchError("Verification code has expired. Resend to proceed")
        if (user.otp !== otp) throw catchError("Verification Code is incorrect")
        // }
        req.body = { otp: "", verifiedAt: new Date() }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateResendCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user.verifiedAt)
            throw catchError("Your account has been verified. Proceed to login")
        const otp = randomInt(1000, 9999)
        req.body = { otp }
        req.params = { id: String(user._id) }
        new Email().SendEmail(
            user,
            "Your verification code",
            `Your verification code is ${otp}`
        )
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateGenerateCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, by = "email" } = req.body
    try {
        console.log(req.body, "GENERATE CODE PAYLOAD")
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )
        const otp = randomInt(1000, 9999)
        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        req.body = { otp }
        // send email
        if (by === "email") {
            new Email().SendEmail(
                user,
                "Your verification code",
                `Your verification code is ${otp}`
            )
        }
        
        if (by === "sms") {
            console.log( user.phoneNumber.startsWith("+")
                    ? user.phoneNumber
                    : `+234${user.phoneNumber}`,
                `Your verification code is ${otp}`, "SMS PHONE NUMBER");
            new Termii().Send(
                user.phoneNumber.startsWith("+")
                    ? user.phoneNumber
                    : `+234${user.phoneNumber}`,
                `Your verification code is ${otp}`
            )
        }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}

export const validateChangePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, otp, password } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                email,
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (!user) throw catchError("Invalid request", 400)
        if (user && !user?.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (user.otp !== otp) throw catchError("Invalid Code")
        req.body = { otp: "", password: encryptData(password) }
        req.params = { id: String(user._id) }
        return next()
    } catch (error) {
        next(error)
    }
}
