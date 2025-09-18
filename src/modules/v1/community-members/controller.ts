/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import CommunityMemberService from "./service"
import CommunityService from "../community/service"
import { db } from "../../../databases/connection"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page, limit, community } = req.query
    try {
        const [result, error] = await tryPromise(
            new CommunityMemberService({}).findAll(
                {
                    community: String(community),
                },
                Number(page),
                Number(limit),
                [{ path: "user", select: "firstName lastName avatar" }]
            )
        )

        if (error) throw catchError("Error processing request")

        return res
            .status(200)
            .json(success("Community Members fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { payload, community } = req.body as {
        payload: string[]
        community: string
    }
    try {
        const [comm, err] = await tryPromise(
            new CommunityService({ _id: community }).findOne()
        )

        if (err) throw catchError("Error processing request")
        if (!comm) throw catchError("This community does not exist")

        const [members, memErr] = await tryPromise(
            new CommunityMemberService({}).findAll({ user: { $in: payload }, community })
        )

        if (memErr) throw catchError("Error processing request")
        const admins = members?.docs
            .filter(d => d.status === "admin")
            .map(d => d.user)
        if (admins?.length && !admins.includes(String(req.user._id)))
            throw catchError("You are not permitted to perform this action")
        const existingMember = (members?.docs.map(d => d.user) || []).map(dx =>
            payload.includes(dx)
        )

        if (existingMember.length)
            throw catchError(`1 or more members already exist`, 400)

        const [_, error] = await tryPromise(
            new CommunityMemberService({}).bulkCreate(
                payload.map(p => ({
                    user: String(p),
                    community,
                    status: "member",
                }))
            )
        )
        await new CommunityService({ _id: community }).update({
            numberOfParticipant:
                Number(comm.numberOfParticipant) + payload.length,
        })

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Community Members Added", {}))
    } catch (error) {
        next(error)
    }
}

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { memberId, community } = req.body
    try {
        const [comm, err] = await tryPromise(
            new CommunityService({ _id: community }).findOne()
        )

        if (err) throw catchError("Error processing request")
        if (!comm) throw catchError("This community does not exist")

        const [member, memErr] = await tryPromise(
            new CommunityMemberService({ user: memberId, community }).findOne()
        )

        if (memErr) throw catchError("Error processing request")
        if (!member) throw catchError("Member does not exist in this community")
        if (member.status === "admin") throw catchError("Cannot remove Admin")

        const session = await db.startSession()
        await session.withTransaction(async () => {
            const [_, error] = await tryPromise(
                new CommunityMemberService({ _id: member._id }).deleteOne(
                    session
                )
            )
            if (error) throw catchError("Error processing request")
            await new CommunityService({ _id: community }).update(
                {
                    numberOfParticipant:
                        comm.numberOfParticipant <= 0
                            ? 0
                            : Number(comm.numberOfParticipant) - 1,
                },
                session
            )
        })

        return res.status(200).json(success("Community Member Removed", {}))
    } catch (error) {
        next(error)
    }
}
