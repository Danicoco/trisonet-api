import { NextFunction, Request, Response } from "express";
import HotelService from "./service";
import { addMinutes } from "date-fns";
import { db } from "../../../databases/connection";
import { success } from "../../common/utils";
import { debitWallet } from "../wallets/helper";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { duration } = req.body;
    try {
        let result;
        const adminFee = 100;
        const totalAmount = Number(duration) * adminFee;
        const session = await db.startSession();
        await session.withTransaction(async () => {
            await debitWallet({
                userId:String(req.user._id),
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    session,
                    amount: totalAmount,
                    isWithdrawal: false,
                    pendingTransaction: false,
                    transactionMeta: { ...req.body },
                    type: "main-wallet"
            })
            result = await new HotelService({}).create({
                ...req.body,
                startDate: new Date(),
                endDate: addMinutes(new Date(), Number(duration)),
                amount: adminFee,
                totalAmount,
                paid: true,
            })
        })
        await session.endSession();
        return res.status(201).json(
            success("Hotel booked", result)
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
    const { page = 1, limit = 20 } = req.query;
    try {
        const filter = {
            user: String(req.user._id),
        }
        const hotels = await new HotelService({}).findAll(filter, Number(page), Number(limit))
        return res.status(201).json(
            success("Hotel booked", hotels)
        )
    } catch (error) {
        next(error)
    }
}