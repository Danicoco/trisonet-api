/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        search: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        name: z.string({ required_error: "Enter community name" }).nonempty(),
        description: z.string().optional(),
        privacy: z.enum(["public", "private"]),
        avatar: z.string().optional(),
        members: z.array(z.string()).optional()
    })
    .strict()

export const updateSchema = z
    .object({
        description: z.string().optional(),
        privacy: z.enum(["public", "private"]).optional(),
        avatar: z.string().optional(),
    })
    .strict()
