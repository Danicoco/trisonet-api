/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        name: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        name: z.string({ required_error: "Enter hotel name" }),
        duration: z.number({ required_error: "Enter duration in minutes" }),
        meta: z.object({}).optional(),
    })
    .strict()
