/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        type: z.enum(["land", "building"]),
        price: z.number().min(0),
        name: z.string({ required_error: "Name is required" }).nonempty(),
        meta: z.any(),
        uniqueName: z.string({ required_error: "Unique Name is required" }).nonempty()
    })
    .strict()

