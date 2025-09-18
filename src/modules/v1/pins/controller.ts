/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import PinService from "./service"
import UserService from "../users/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [pin, err] = await tryPromise(
            new PinService({ user: req.user._id }).findOne()
        )

        if (err) throw catchError("Error processing request");
        if (pin) throw catchError("You already added your pin");

        console.log({...req.body,
            user: String(req.user._id)})
        const [result, error] = await tryPromise(
            new PinService({}).create({
                ...req.body,
                user: String(req.user._id),
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Pin added", result))
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { otp } = req.body;
    try {
        const [user, uErr] = await tryPromise(
            new UserService({ _id: req.user._id }).findOne()
        )

        if (uErr) throw catchError("Error processing request");
        if (String(user?.otp) !== otp) throw catchError("Invalid OTP");


        const [pin, err] = await tryPromise(
            new PinService({ user: req.user._id }).findOne()
        )

        if (err) throw catchError("Error processing request");
        if (!pin) throw catchError("Please create your pin first");

        const [result, error] = await tryPromise(
            new PinService({ user: String(req.user._id) }).update({
                ...req.body,
            })
        )

        if (error) throw catchError("Error processing request")
        await tryPromise(new UserService({ _id: user?._id }).update({ otp: "" }))

        return res.status(200).json(success("Pin updated", result))
    } catch (error) {
        next(error)
    }
}

export const get = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [pin, err] = await tryPromise(
            new PinService({ user: req.user._id }).findOne()
        )

        if (err) throw catchError("Error processing request")        

        return res.status(200).json(success("Pin retrieved", pin))
    } catch (error) {
        next(error)
    }
}
