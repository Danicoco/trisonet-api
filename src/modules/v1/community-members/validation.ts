/** @format */

import { z } from "zod"


export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        community: z.string({ required_error: "Community is required" }).nonempty(),
    })
    .strict()

export const createSchema = z
    .object({
        community: z.string({ required_error: "Community ID is required" }).nonempty(),
        payload: z.array(z.string({ required_error: "User ID is required" }).nonempty())
    })
    .strict()

export const removeSchema = z
    .object({
        community: z.string({ required_error: "Community ID is required" }).nonempty(),
        memberId: z.string().nonempty()
    })
    .strict()
