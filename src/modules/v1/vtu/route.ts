/** @format */

import { Router } from "express"

import { validator } from "../../common/utils"
import {
    retrieveVTU,
    verifyMeter,
    purchaseData,
    purchaseAirtime,
    purchaseElectricity,
} from "./controller"
import {
    vtuSchema,
    dataSchema,
    verifySchema,
    airtimeSchema,
    electricitySchema,
} from "./validation"

const vtuRouter = Router({
    caseSensitive: true,
    strict: true,
})

vtuRouter.get("/", validator.query(vtuSchema), retrieveVTU)
vtuRouter.post(
    "/purchase-airtime",
    validator.body(airtimeSchema),
    purchaseAirtime
)
vtuRouter.post("/purchase-data", validator.body(dataSchema), purchaseData)
vtuRouter.post("/verify-customer", validator.body(verifySchema), verifyMeter)
vtuRouter.post(
    "/purchase-electricity",
    validator.body(electricitySchema),
    purchaseElectricity
)

export default vtuRouter
