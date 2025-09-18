/** @format */

import { z } from "zod"

export const basicUserValidation = z
    .object({
        email: z
            .string()
            .email({ message: "Provide a valid email" })
            .nonempty({ message: "Enter your email" })
            .trim()
            .toLowerCase(),
        password: z.string().nonempty({ message: "Password cannot be empty" }),
    })
    .required()
    .strict()

export const createSchema = z
    .object({
        description: z
            .string({ required_error: "What's on your mind today?" })
            .nonempty(),
        attachments: z.array(z.string()).optional(),
    })
    .strict()


export const fetchSchema = z
    .object({
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
    })
    .strict()
