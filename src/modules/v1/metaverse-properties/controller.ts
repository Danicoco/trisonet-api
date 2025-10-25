/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import MetaversePropertyServiceService from "./service"
import { db } from "../../../databases/connection"
import { debitWallet } from "../wallets/helper"
import MetaverseService from "../metaverse/service"
import MetaVerseAssetService from "../metaverse-assets/service"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 1000, userId } = req.query
    try {
        const [adminProperties, err] = await tryPromise(
            new MetaversePropertyServiceService({}).findAll(
                {
                    admin: { $exists: true },
                    isActive: true,
                },
                1,
                100
            )
        )

        if (err) throw catchError("Error processing request")

        const [result, error] = await tryPromise(
            new MetaversePropertyServiceService({}).findAll(
                {
                    $and: [
                        {
                            admin: { $exists: false },
                            ...(userId && { _id: userId })
                        },
                        {
                            sold: false,
                        },
                        {
                            dateSold: { $exists: false },
                        },
                    ],
                },
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request", 400)

        const arr = [...(adminProperties?.docs || []), ...(result?.docs || [])]

        return res
            .status(200)
            .json(success("Metaverse properties fetched", arr))
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
        const [result, error] = await tryPromise(
            new MetaversePropertyServiceService({}).create({
                ...req.body,
                admin: req.user._id,
                dateAcquired: new Date(),
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Property created", result))
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
            new MetaversePropertyServiceService({ _id: req.params._id }).update(
                {
                    ...req.body,
                }
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Property updated", result))
    } catch (error) {
        next(error)
    }
}

export const buy = async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params
    try {
        const property = await new MetaversePropertyServiceService({
            _id,
        }).findOne()
        if (!property) throw catchError("Properties not working")
        if (!property.forSale) throw catchError("Property not for sale")
        if (property.dateSold) throw catchError("Properties already sold")

        const userToBuyMeta = await new MetaverseService({
            user: req.user._id,
        }).findOne()

        if (!userToBuyMeta) throw catchError("You don't have a valid meta ID")
        const session = await db.startSession()
        let result
        await session.withTransaction(async () => {
            if (property.price) {
                await debitWallet({
                    userId: String(req.user._id),
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    session,
                    amount: property.price,
                    isWithdrawal: false,
                    pendingTransaction: false,
                    transactionMeta: { action: `Virtual ${property.type}` },
                    type: "main-wallet",
                })
            }

            await new MetaversePropertyServiceService({
                _id: req.params._id,
            }).update({
                dateSold: new Date(),
                isActive: false,
                sold: true,
            })

            const id = property._id
            delete property._id
            delete property.createdAt
            delete property.deletedAt
            delete property.admin
            delete property.dateSold

            result = await new MetaversePropertyServiceService({}).create({
                ...property,
                meta: {
                    ...property.meta,
                    soldId: id,
                    priceBought: property.price,
                },
                sold: false,
                forSale: false,
                user: String(req.user._id),
                dateAcquired: new Date(),
                isActive: true,
                metaverse: String(userToBuyMeta._id),
            })
        })
        await session.endSession()

        return res.status(200).json(success("Property sold", result))
    } catch (error) {
        next(error)
    }
}

export const develop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    const { assetId } = req.body
    try {
        const property = await new MetaversePropertyServiceService({
            _id,
            user: String(req.user._id),
        }).findOne()
        if (!property) throw catchError("You do not own property")
        if (property.meta?.uniqueName)
            throw catchError("Property already developed")
        if (["car", "building"].includes(property.type)) {
            throw catchError("You cannot develop on this property")
        }

        const [userToBuyMeta, asset] = await Promise.all([
            new MetaverseService({
                user: req.user._id,
            }).findOne(),
            new MetaVerseAssetService({ _id: assetId }).findOne(),
        ])

        if (!userToBuyMeta) throw catchError("You don't have a valid meta ID")
        if (!asset) throw catchError("Asset does not exist")

        const session = await db.startSession()
        let result
        await session.withTransaction(async () => {
            if (property.price) {
                await debitWallet({
                    userId: String(req.user._id),
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    session,
                    amount: asset.price,
                    isWithdrawal: false,
                    pendingTransaction: false,
                    transactionMeta: {
                        action: `Develop ${asset.name} on land`,
                    },
                    type: "main-wallet",
                })
            }
            result = await new MetaversePropertyServiceService({
                _id: req.params._id,
            }).update({
                meta: {
                    ...property.meta,
                    ...asset,
                },
            })
        })
        await session.endSession()

        return res.status(200).json(success("Property developed", result))
    } catch (error) {
        next(error)
    }
}

export const forSale = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    const { forSale, price } = req.body;
    try {
        const property = await new MetaversePropertyServiceService({
            _id,
        }).findOne()
        if (!property) throw catchError("Properties not working")
        if (String(req.user._id) !== property.user)
            throw catchError("Cannot perform operation")

        const resp = await new MetaversePropertyServiceService({ _id }).update({
            forSale,
            price
        })

        return res.status(200).json(success("Property updated", resp))
    } catch (error) {
        next(error)
    }
}
