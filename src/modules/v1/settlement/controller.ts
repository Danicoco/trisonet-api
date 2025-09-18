import { NextFunction, Request, Response } from "express";
import { catchError, tryPromise } from "../../common/utils";
import SettlementService from "./service";


export const processIncomingTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [_, error] = await tryPromise(
            new SettlementService({}).create({
                type: "SETTLEMENT",
                meta: { ...req.body.data },
                status: 'pending'
            })
        );

        if (error) throw catchError('Error processing request', 400);
        
        return res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}