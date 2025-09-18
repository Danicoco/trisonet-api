/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import PostService from "./service"
import { db } from "../../../databases/connection"
import NotificationService from "../notifications/service"
import PostLikeService from "../post-likes/service"

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [_, crtError] = await tryPromise(
            new PostService({}).create({
                ...req.body,
                user: { ...req.user },
                numberOfReplies: 0,
                numberOfLikes: 0,
            })
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res.status(201).json(success("Post added successfully", {}, {}))
    } catch (error) {
        next(error)
    }
}

export const reply = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    try {
        const [post, error] = await tryPromise(
            new PostService({ _id }).findOne()
        )

        if (error) throw catchError("There was an error. Try again")
        if (!post) throw catchError("Post no longer available")

        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [reply, crtError] = await tryPromise(
                new PostService({}).create(
                    {
                        post: post._id,
                        ...req.body,
                        user: { ...req.user },
                        numberOfReplies: 0,
                    },
                    session
                )
            )

            if (crtError) throw catchError("An error occurred! Try again", 400)
            if (!reply) throw catchError("An error occurred! Try again", 400)

            const [_o, upError] = await tryPromise(
                new PostService({ _id }).update(
                    {
                        numberOfReplies: Number(post.numberOfReplies) + 1,
                    },
                    session
                )
            )

            if (upError) throw catchError("An error occurred! Try again", 400)
            await new NotificationService({}).create(
                {
                    user: String(post.user._id),
                    post: String(post._id),
                    action: `${req.user.firstName} ${req.user.lastName} commented on your post`,
                    section: "reply",
                    createdBy: String(req.user._id),
                },
                session
            )
        })
        await session.endSession()

        return res
            .status(201)
            .json(success("Repies added successfully", {}, {}))
    } catch (error) {
        next(error)
    }
}

export const like = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const [post, likes] = await Promise.all([
            new PostService({ _id }).findOne(),
            new PostLikeService({ post: _id }).findOne(),
        ])

        if (!post) throw catchError("Post no longer available")

        console.log({ likes })

        const count = likes
            ? post.numberOfLikes <= 0
                ? 0
                : Number(post.numberOfLikes) - 1
            : Number(post.numberOfLikes) + 1

        console.log({ count })

        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [_o, upError] = await tryPromise(
                new PostService({ _id }).update({
                    numberOfLikes: count,
                })
            )

            if (upError) throw catchError("An error occurred! Try again", 400)
            if (!likes) {
                await new PostLikeService({}).create(
                    {
                        user: String(req.user._id),
                        postCreator: post.user._id,
                        post: _id,
                    },
                    session
                )
            }
            if (likes) {
                await new PostLikeService({
                    user: String(req.user._id),
                }).deleteOne(session)
            }
            await new NotificationService({}).create(
                {
                    user: String(post.user._id),
                    post: String(post._id),
                    action: `${req.user.firstName} ${req.user.lastName} likes your post`,
                    section: "like",
                    createdBy: String(req.user._id),
                },
                session
            )
        })
        await session.endSession()

        return res.status(201).json(success("Like added successfully", {}, {}))
    } catch (error) {
        next(error)
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const [post, error] = await tryPromise(
            new PostService({ _id }).findOne()
        )

        if (error) throw catchError("There was an error. Try again")
        if (!post) throw catchError("Post no longer available")

        const [replies, crtError] = await tryPromise(
            new PostService({}).findAll({ post: _id })
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res
            .status(200)
            .json(success("Post retrieved", { post, replies }))
    } catch (error) {
        next(error)
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user, page = 1, limit = 10 } = req.query
    console.log({ query: req.query }, "POST FOR USER")
    try {
        const [posts, crtError] = await tryPromise(
            new PostService({}).findAll(
                {
                    ...(user && { "user._id": user }),
                    post: { $exists: false },
                },
                Number(page),
                Number(limit)
            )
        )

        if (crtError) throw catchError("An error occurred! Try again", 400)

        return res
            .status(200)
            .json(success("Posts retrieved successfully", { posts }))
    } catch (error) {
        next(error)
    }
}
