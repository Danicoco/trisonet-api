/** @format */

import { z } from "zod"


export const fetchSchema = z
    .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        section: z.string().optional(),
    })
    .strict()
