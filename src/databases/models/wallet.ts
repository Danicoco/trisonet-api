/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IWallet } from "../../types"

const bankSchema = new Schema(
    {
        accountNumber: { type: "String" },
        accountName: { type: "String" },
        bankName: { type: "String" },
    }
)

const WalletSchema: Schema = new Schema<IWallet>(
    {
        balance: { type: "Number", required: true, default: 0 },
        type: { type: "String" },
        bank: { type: bankSchema },
        user: { type: "String", required: true, ref: "User" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "wallets",
    }
)

WalletSchema.set("timestamps", true)
WalletSchema.plugin(mongoosePagination)
WalletSchema.index({ user: 1, type: 1 })

const WalletModel = db.model<IWallet, Pagination<IWallet>>(
    "Wallet",
    // @ts-ignore
    WalletSchema
)

export default WalletModel
