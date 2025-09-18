/** @format */
import { NextFunction, Request, Response } from "express"

import { catchError, success, tryPromise } from "../../common/utils"
import { composeFilter } from "./helper"
import UserService from "./service"
import { decrytData, encryptData } from "../../common/hashings"
import { addHours } from "date-fns"
import { randomInt } from "crypto"
import FollowService from "../follow/service"
import { db } from "../../../databases/connection"
import CommunityMemberService from "../community-members/service"
import { getGeneralCommunity } from "../community-chats/helper"
import Email from "../../thirdpartyApi/zeptomail"
import Termii from "../../thirdpartyApi/termii"
import WalletService from "../wallets/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let newUser: any
        const otp = randomInt(1000, 9999)
        const generalCommunity = await getGeneralCommunity()
        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [user, crtError] = await tryPromise(
                new UserService({}).create(
                    {
                        ...req.body,
                        otp,
                        password: encryptData(req.body.password),
                    },
                    session
                )
            )

            if (crtError) throw catchError("An error occurred! Try again", 400)
            newUser = user
            await new CommunityMemberService({}).create(
                {
                    user: String(user?._id),
                    community: String(generalCommunity._id),
                    status: "member",
                },
                session
            )
        })
        await session.endSession()

        if (newUser) {
            new Email().SendEmail(
                newUser!,
                "Your verification code",
                `Your verification code is ${otp}`
            )

            new Termii().Send(
                newUser.phoneNumber,
                `Your verification code is ${otp}`
            )
        }

        return res
            .status(201)
            .json(success("Account created successfully", {}, {}))
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { to, password } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({
                $or: [{ phoneNumber: to }, { email: to }],
            }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)

        if (!user) throw catchError("Email/Password is incorrect", 404)
        if (!user.isActive)
            throw catchError("Your account has been deactivated", 400)
        if (decrytData(user.password) !== password)
            throw catchError("Email/Password is incorrect", 400)

        const token = encryptData(
            JSON.stringify({ _id: user._id, exp: addHours(new Date(), 48) })
        )

        return res
            .status(200)
            .json(
                success(
                    "Logged In successfully",
                    { verificationStatus: !!user.verifiedAt },
                    { token }
                )
            )
    } catch (error) {
        next(error)
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [_, error] = await tryPromise(
            new UserService({ _id: req.params.id || req.user._id }).update(
                req.body
            )
        )

        if (error) throw catchError("Error processing request", 400)
        return res.status(200).json(success("Account updated successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const validateOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { otp, email } = req.body
    try {
        const [user, error] = await tryPromise(
            new UserService({ email }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (user?.otp !== otp) throw catchError("Invalid OTP")
        return res.status(200).json(success("OTP Validate successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const followAndUnfollow = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    try {
        if (String(_id) === String(req.user._id))
            throw catchError("You can't follow yourself")

        const [follow, user] = await Promise.all([
            new FollowService({
                user: String(req.user._id),
                following: _id,
            }).findOne(),
            new UserService({ _id, isActive: true }).findOne(),
        ])

        if (!user) throw catchError("User is no longer active", 400)

        const session = await db.startSession()
        await session.withTransaction(async () => {
            if (follow) {
                await new UserService({ _id }).update(
                    {
                        numberOfFollowers:
                            Number(user.numberOfFollowers || 0) - 1,
                    },
                    session
                )
                await new UserService({ _id: req.user._id }).update(
                    {
                        numberOfFollowing:
                            Number(req.user.numberOfFollowing || 0) - 1,
                    },
                    session
                )
                await new FollowService({ _id: follow._id }).deleteOne()
            }

            if (!follow) {
                await new UserService({ _id }).update(
                    {
                        numberOfFollowers:
                            Number(user.numberOfFollowers || 0) + 1,
                    },
                    session
                )
                await new UserService({ _id: req.user._id }).update(
                    {
                        numberOfFollowing:
                            Number(req.user.numberOfFollowing || 0) + 1,
                    },
                    session
                )
                await new FollowService({}).create({
                    user: String(req.user._id),
                    following: _id,
                    dateFollowed: new Date(),
                })
            }
        })
        await session.endSession()

        return res.status(200).json(success("Request process successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const profile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.query
    let user = req.user
    try {
        if (userId) {
            const [nU, err] = await tryPromise(
                new UserService({ _id: userId }).findOne()
            )

            if (err) throw catchError("Error processing request")
            if (!nU) throw catchError("Invalid Request")
            user = nU
        }

        const excludeFields = ["password", "otp", "promo"]
        const result = Object.keys(user).reduce((acc, curr) => {
            if (!excludeFields.includes(curr)) {
                // @ts-ignore
                acc[curr] = user[curr]
            }
            return acc
        }, {})

        return res
            .status(200)
            .json(success("Account retrieved successfully", result))
    } catch (error) {
        next(error)
    }
}

export const adminProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await new WalletService({}).findAll(
            {
                user: req.params.id,
            },
            1,
            2
        )
        const user = await new UserService({ _id: req.params.id }).findOne()

        return res
            .status(200)
            .json(
                success("Account retrieved successfully", {
                    wallet: result?.docs,
                    user,
                })
            )
    } catch (error) {
        next(error)
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit } = req.query
    try {
        const [users, error] = await tryPromise(
            new UserService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Errors retrieving users", 400)

        return res.status(200).json(success("Users retrieved", users))
    } catch (error) {
        next(error)
    }
}
