/** @format */

import { z } from "zod"


export const createSchema = z
    .object({
        code: z.string().nonempty()
    })
    .strict()

export const updateSchema = z
    .object({
        code: z.string(),
        otp: z.string(),
    })
    .strict()
