/** @format */

import { NextFunction, Request, Response } from "express"
import VTU from "../../thirdpartyApi/vtu"
import { catchError, success, tryPromise } from "../../common/utils"
import { db } from "../../../databases/connection"
import PinService from "../pins/service"
import { debitWallet } from "../wallets/helper"

export const retrieveVTU = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { type = "airtime", network } = req.query
    try {
        console.log({ type, network })
        const airtime =
            type === "airtime"
                ? await new VTU().getAirtimeVTU()
                : await new VTU().getDataVariation(String(network))

        return res.status(200).json(success("Airtime retrieved", airtime))
    } catch (error) {
        next(error)
    }
}

export const purchaseAirtime = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, network, amount, pin } = req.body
    try {
        const [dbPin, error] = await tryPromise(
            new PinService({ user: String(req.user._id), code: pin }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (!dbPin) throw catchError("Invalid Pin")

        await new VTU()
            .purchaseAirtimeVTU(phoneNumber, network, amount)
            .catch(() => {
                throw catchError(
                    "There is an issue from our end. Please try again"
                )
            })

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount,
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: { action: `${network} Ng Vtu ${phoneNumber}`, ...req.body },
                type: "main-wallet",
            })
        })

        return res
            .status(200)
            .json(success("Airtime purchased successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const purchaseData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { phoneNumber, network, amount, pin, variationId } = req.body
    try {
        const [dbPin, error] = await tryPromise(
            new PinService({ user: String(req.user._id), code: pin }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (!dbPin) throw catchError("Invalid Pin")

        await new VTU()
            .purchaseDataVTU(phoneNumber, network, variationId)
            .catch(() => {
                throw catchError(
                    "There is an issue from our end. Please try again"
                )
            })
        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount,
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: { action: `${network} Nigeria`, ...req.body },
                type: "main-wallet",
            })
        })

        return res.status(200).json(success("Data purchased successfully", {}))
    } catch (error) {
        next(error)
    }
}

export const verifyMeter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { meterNumber, service, variationId } = req.body
    try {
        const data = await new VTU()
            .verifyCustomer(meterNumber, service, variationId)
            .catch(() => {
                throw catchError(
                    "There is an issue from our end. Please try again"
                )
            })

        return res
            .status(200)
            .json(success("Customer verified successfully", data))
    } catch (error) {
        next(error)
    }
}

export const purchaseElectricity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { meterNumber, service, variationId, amount, pin, phone } = req.body

    try {
        const [dbPin, error] = await tryPromise(
            new PinService({ user: String(req.user._id), code: pin }).findOne()
        )

        if (error) throw catchError("Error processing request")
        if (!dbPin) throw catchError("Invalid Pin")

        await new VTU()
            .purchaseElectricity({
                service_id: service,
                customer_id: meterNumber,
                variation_id: variationId,
                amount,
                phone,
            })
            .catch(() => {
                throw catchError(
                    "There is an issue from our end. Please try again"
                )
            })

        const session = await db.startSession()
        await session.withTransaction(async () => {
            await debitWallet({
                userId: String(req.user._id),
                name: `${req.user.firstName} ${req.user.lastName}`,
                session,
                amount,
                isWithdrawal: false,
                pendingTransaction: false,
                transactionMeta: { action: "Electricity", ...req.body },
                type: "main-wallet",
            })
        })

        return res
            .status(200)
            .json(success("Customer verified successfully", {}))
    } catch (error) {
        next(error)
    }
}
