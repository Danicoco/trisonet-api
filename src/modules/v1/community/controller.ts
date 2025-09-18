/** @format */

import { NextFunction, Request, Response } from "express"
import {
    catchError,
    createExactMatchRegex,
    success,
    tryPromise,
} from "../../common/utils"
import CommunityService from "./service"
import CommunityMemberService from "../community-members/service"
import { db } from "../../../databases/connection"
import { communityPipeline } from "./helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { search } = req.query
    try {
        const [member, err] = await tryPromise(
            new CommunityMemberService({}).findAll({
                $or: [{ user: req.user._id }],
            })
        )

        if (err) throw catchError("Error processing request")

        console.log({ member })

        const communityIds = member?.docs.map(mem => mem.community) || []

        console.log({ communityIds })

        const [result, error] = await tryPromise(
            new CommunityService({}).aggregate(
                // @ts-ignore
                communityPipeline(String(req.user._id), {
                    ...(search
                        ? {
                              name: createExactMatchRegex(search as string),
                              privacy: "public",
                          }
                        : {
                              $or: [
                                  {
                                      $or: [
                                          { _id: { $in: communityIds } },
                                          {
                                              privacy: "public",
                                          },
                                      ],
                                  },
                                  {
                                      privacy: "private",
                                      user: String(req.user._id),
                                  },
                              ],
                          }),
                })
            )
        )

        console.log({ result })

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Communities fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { privacy, members = [] } = req.body
    try {
        let result = {}
        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [results, error] = await tryPromise(
                new CommunityService({}).create(
                    {
                        ...req.body,
                        ...(privacy === "private" && {
                            inviteLink: `https://trisonet.com/community/${new Date().getTime()}`,
                        }),
                        user: req.user._id,
                        numberOfParticipant: members?.length || 1,
                    },
                    session
                )
            )
            result = results || {}
            if (error) throw catchError("Error processing request")
            await tryPromise(
                new CommunityMemberService({}).bulkCreate([
                    ...members.map((mem: string) => ({
                        user: mem,
                        community: results?._id,
                        status: "member",
                    })),
                    {
                        user: req.user._id,
                        community: results?._id,
                        status: "admin",
                    },
                ])
            )
        })

        await session.endSession()

        return res
            .status(200)
            .json(
                success("Communities created", {
                    ...result,
                    user: { ...req.user },
                })
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
    const { privacy } = req.body
    try {
        const [result, error] = await tryPromise(
            new CommunityService({ _id: req.params._id }).update({
                ...req.body,
                ...(privacy === "private" && {
                    inviteLink: `https://trisonet.com/community/${new Date().getTime()}`,
                }),
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Communities created", result))
    } catch (error) {
        next(error)
    }
}
