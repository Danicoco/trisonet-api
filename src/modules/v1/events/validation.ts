/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        free: z.string().optional(),
        paid: z.string().optional(),
        title: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        title: z.string({ required_error: "Enter title" }),
        description: z.string({ required_error: "Event descripton" }),
        location: z.string(),
        date: z.string(),
        amount: z.number(),
        attachments: z.array(z.string()),
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
