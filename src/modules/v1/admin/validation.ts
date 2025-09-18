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

export const loginSchema = z
    .object({
        email: z.string({ required_error: "Email is required" }).email({ message: "Enter valid email" }).nonempty(),
        password: z.string({ required_error: "Enter password" }).nonempty().min(8, "Password must be 8 characters or more")
    })
    .strict()

export const createSchema = z
    .object({
        email: z.string({ required_error: "Email is required" }).email({ message: "Enter valid email" }).nonempty(),
        password: z.string({ required_error: "Enter password" }).nonempty().min(8, "Password must be 8 characters or more"),
        name: z.string({ required_error: "Enter name" }).nonempty(),
        role: z.enum(["super-admin", "metaverse", "marketplace"])
    })
    .strict()

    export const updateSchema = z
    .object({
        email: z.string().optional(),
        name: z.string().optional(),
        role: z.enum(["super-admin", "metaverse", "marketplace"]).optional()
    })
    .strict()