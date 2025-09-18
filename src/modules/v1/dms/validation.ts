/** @format */

import { z } from "zod"


export const fetchSchema = z
    .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        status: z.string().optional(),
        user: z.string().optional(),
    })
    .strict()
