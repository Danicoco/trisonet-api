/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        userId: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        type: z.enum(["land", "car"]),
        price: z.number().min(0),
        forSale: z.boolean(),
        meta: z.any()
    })
    .strict()


export const developSchema = z
    .object({
        assetId: z.string({ required_error: "Asset is required" }).nonempty()
    })
    .strict()

