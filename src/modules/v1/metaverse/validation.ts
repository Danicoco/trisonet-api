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
        avatar: z.string({ required_error: "Enter avatar name" }).nonempty(),
    })
    .strict()

export const updateSchema = z
    .object({
        description: z.string().optional(),
        privacy: z.enum(["public", "private"]).optional(),
        avatar: z.string().optional(),
    })
    .strict()
