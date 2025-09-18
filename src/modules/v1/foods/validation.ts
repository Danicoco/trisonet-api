/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        category: z.string().optional(),
        title: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        title: z.string({ required_error: "Enter title" }),
        description: z.string({ required_error: "Event descripton" }),
        categories: z.array(z.string()),
        price: z.number(),
        quantity: z.number(),
        attachment: z.string(),
    })
    .strict()

export const updateSchema = z
    .object({
        description: z.string().optional(),
        categories: z.array(z.string()).optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
        attachment: z.string().optional(),
    })
    .strict()
