/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import MetaverseEventService from "./service"
import { db } from "../../../databases/connection"
import { debitWallet } from "../wallets/helper"
import MetaverseService from "../metaverse/service"
import SubscriptionService from "../subscriptions/service"
import { createInvitationCode } from "./helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        page = 1,
        limit = 10,
        townHall,
        eventId,
        invitationCode,
        expired,
    } = req.query
    try {
        const [result, error] = await tryPromise(
            new MetaverseEventService({}).findAll(
                {
                    ...(!townHall && { user: req.user._id }),
                    ...(eventId && { _id: eventId }),
                    ...(invitationCode && { _id: invitationCode }),
                    isActive: true,
                    ...(!expired && {
                        endDate: { $gte: new Date() },
                    }),
                },
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Event fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subscribed = await new SubscriptionService({
            user: req.user._id,
            isActive: true,
        }).findOne()
        if (!subscribed)
            throw catchError(
                "You're not subscribed. Kindly subscribe to create event",
                400
            )
        const count = await new MetaverseEventService({}).count()
        const metaverse = await new MetaverseService({
            user: req.user._id,
        }).findOne()
        if (!metaverse) throw catchError("You're yet to select avatar")
        let result = await new MetaverseEventService({}).create({
            ...req.body,
            isActive: true,
            user: req.user._id,
            metaverse: metaverse._id,
            invitationCode: createInvitationCode(String(count || 1)),
        })

        return res.status(200).json(success("Event created", result))
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
        const [result, error] = await tryPromise(
            new MetaverseEventService({ _id: req.params._id }).update({
                ...req.body,
                isActive: true,
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Event updated", result))
    } catch (error) {
        next(error)
    }
}

export const registerForEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [result, error] = await tryPromise(
            new MetaverseEventService({
                _id: req.params._id,
                isActive: true,
            }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (!result) throw catchError("Event is no longer active")
        if (result.user === String(req.user._id))
            throw catchError("You created this event. Invite others")
        const isParticipant = result.participant.find(
            part => String(part._id) === String(req.user._id)
        )
        if (isParticipant)
            throw catchError("You already registered for this event")

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session: session,
                amount: result.amount,
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: { metaverseId: result.metaverse },
                type: "coin-wallet",
            })
            await new MetaverseEventService({ _id: req.params._id }).update({
                participant: [
                    ...result?.participant,
                    {
                        _id: String(req.user._id),
                        name: `${req.user.firstName} ${req.user.lastName}`,
                    },
                ],
            })
        })
        await session.endSession()

        return res.status(200).json(success("Processed", result))
    } catch (error) {
        next(error)
    }
}
