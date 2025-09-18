/** @format */

import { z } from "zod"


export const convertSchema = z
    .object({
       amount: z.number()
    })
    .strict()
