/** @format */

import { Router } from "express"

import { get, getSubscriptionFee, subscribe } from "./controller"

const SubscriptionRouter = Router({
    caseSensitive: true,
    strict: true,
})

SubscriptionRouter.get("/", get)
SubscriptionRouter.post("/", subscribe)
SubscriptionRouter.get("/fee", getSubscriptionFee)

export default SubscriptionRouter
