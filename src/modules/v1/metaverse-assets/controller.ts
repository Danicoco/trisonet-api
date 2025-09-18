/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import MetaVerseAssetService from "./service"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const [result, error] = await tryPromise(
            new MetaVerseAssetService({}).findAll(
                {},
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request", 400);

        return res
            .status(200)
            .json(success("Metaverse assets fetched", result))
    } catch (error) {
        next(error)
    }
}

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { uniqueName} = req.body;
    try {
        const [asset, err] = await tryPromise(
            new MetaVerseAssetService({ uniqueName }).findOne(),
        )

        if (err) throw catchError("Error processing request", 400);
        if (asset) throw catchError(`${uniqueName} already exist. Please use another unique name`);
        const [result, error] = await tryPromise(
            new MetaVerseAssetService({}).create({
                ...req.body,
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Assets created", result))
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
        const [asset, err] = await tryPromise(
            new MetaVerseAssetService({ _id: req.params._id }).findOne(),
        )

        if (err) throw catchError("Error processing request", 400);
        if (!asset) throw catchError("Assets does not exists");
        const [result, error] = await tryPromise(
            new MetaVerseAssetService({ _id: req.params._id }).update(
                {
                    ...req.body,
                }
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Assets updated", result))
    } catch (error) {
        next(error)
    }
}
