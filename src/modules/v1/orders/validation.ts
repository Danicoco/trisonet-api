/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        admin: z.string().optional(),
        status: z.string().optional(),
        title: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        delivery: z.object({ address: z.string(), phoneNumber: z.string() }),
        items: z.array(z.object({ foodId: z.string(), quantity: z.number() }))
    })
    .strict()

export const updateSchema = z
    .object({
        description: z.string().optional(),
        location: z.string().optional(),
        date: z.string().optional(),
        amount: z.number().optional(),
        attachments: z.array(z.string()).optional(),
    })
    .strict()
