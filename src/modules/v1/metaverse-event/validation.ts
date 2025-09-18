/** @format */

import { z } from "zod"

export const fetchSchema = z
    .object({
        page: z.string().optional(),
        limit: z.string().optional(),
        invitationCode: z.string().optional(),
        eventId: z.string().optional(),
        townHall: z.string().optional(),
        expired: z.string().optional(),
    })
    .strict()

export const createSchema = z
    .object({
        title: z.string({ required_error: "Enter event title" }).nonempty(),
        description: z.string().optional(),
        amount: z.number().min(0),
        location: z.string({ required_error: "Enter location" }).nonempty(),
        startDate: z.string({ required_error: "Enter start date" }).nonempty(),
        endDate: z.string({ required_error: "Enter start date" }).nonempty()
    })
    .strict()

