/** @format */

import { NextFunction, Request, Response } from "express"
import { catchError, success, tryPromise } from "../../common/utils"
import FoodService from "./service"
import { composeFilter } from "./helper"

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const [result, error] = await tryPromise(
            new FoodService({}).findAll(
                composeFilter(req),
                Number(page),
                Number(limit)
            )
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Foods fetched", result))
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
            new FoodService({}).create({
                ...req.body,
                admin: String(req.user._id),
            })
        )
        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Food created", result))
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
            new FoodService({ _id: req.params._id }).update({
                ...req.body,
            })
        )

        if (error) throw catchError("Error processing request")

        return res.status(200).json(success("Food updated", result))
    } catch (error) {
        next(error)
    }
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = [
            'Best Selling',
            'Drinks',
            'Protein',
            'Snacks',
            'Main Dish'
        ]

        return res.status(200).json(success("Categories retrieved", categories))
    } catch (error) {
        next(error);
    }
}