/** @format */

import { z } from "zod"

export const vtuSchema = z
    .object({
        type: z.enum(["airtime", "data"]),
        network: z.enum(["mtn", "glo", "9mobile", "airtel"]).optional(),
    })
    .strict()

export const airtimeSchema = z
    .object({
        phoneNumber: z
            .string({ required_error: "Enter phone number" })
            .nonempty(),
        amount: z.number(),
        pin: z.string({ required_error: "Pin is required" }).nonempty(),
        network: z.enum(["mtn", "glo", "9mobile", "airtel"]),
    })
    .strict()

export const dataSchema = z
    .object({
        phoneNumber: z
            .string({ required_error: "Enter phone number" })
            .nonempty(),
        amount: z.number(),
        pin: z.string({ required_error: "Pin is required" }).nonempty(),
        variationId: z
            .string({ required_error: "variationId is required" })
            .nonempty(),
        network: z.enum(["mtn", "glo", "9mobile", "airtel"]),
    })
    .strict()

export const verifySchema = z
    .object({
        meterNumber: z
            .string({ required_error: "Enter meter number" })
            .nonempty(),
        service: z.string(),
        variationId: z
            .string({ required_error: "variationId is required" })
            .nonempty(),
    })
    .strict()

export const electricitySchema = z
    .object({
        meterNumber: z
            .string({ required_error: "Enter meta number" })
            .nonempty(),
        amount: z.number(),
        pin: z.string({ required_error: "Pin is required" }).nonempty(),
        variationId: z
            .string({ required_error: "variationId is required" })
            .nonempty(),
        service: z.string(),
        phone: z.string(),
    })
    .strict()
