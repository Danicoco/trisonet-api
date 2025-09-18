/** @format */

import { catchError, createReference, tryPromise } from "../../common/utils"
import WalletService from "./service"
import TransactionService from "../transactions/service"
import { composeTransactionDoc } from "../transactions/helper"
import { TRANSACTION_STATUS } from "../transactions/constant"
import { ClientSession } from "mongoose"
import Sarepay from "../../thirdpartyApi/sarepay"
import { ISarepayVirtualResponse, IUser } from "../../../types"
import UserService from "../users/service"

export const getBankDetails = (account: ISarepayVirtualResponse) => {
    return {
        accountNumber: account.account_number,
        accountName: account.account_name,
        bankName: account.bank,
    }
}

export const createWallet = async (user: IUser): Promise<ISarepayVirtualResponse> => {
    const reference = createReference("WAL")

    const account = await new Sarepay().createReserveAccount({
        ...user,
        dob: String(user.dateOfBirth),
        otherName:
            user.firstName?.charAt(0)?.toUpperCase() +
            String(user.lastName?.charAt(0)?.toUpperCase()),
        reference,
    })

    if (!account) throw catchError("Error processing request")

    return account
}

export const getWallet = async (
    userId: string,
    name: string,
    type: "main-wallet" | "coin-wallet"
) => {
    let result
    const [wallet, error] = await tryPromise(
        new WalletService({ type, user: String(userId) }).findOne()
    )

    if (error) throw catchError("Error processing request")

    result = wallet
    if (!wallet) {
        const user = await new UserService({
            _id: userId,
            isActive: true,
        }).findOne()
        if (!user) throw catchError("Error processing request")
        // const account = await createWallet(user)
        // const bank = getBankDetails(account)
        result = await new WalletService({}).create({
            type,
            user: String(userId),
            balance: 0,
            // ...(type === "main-wallet" && { bank }),
        })
    }

    return result
}

type Props = {
    userId: string
    name: string
    session: ClientSession
    amount: number
    isWithdrawal: boolean
    pendingTransaction: boolean
    transactionMeta?: Record<string, any>
    type: "main-wallet" | "coin-wallet"
}

export const debitWallet = async (params: Props) => {
    const { userId, session, amount, type, name } = params
    const [wallet, error] = await tryPromise(getWallet(userId, name, type))

    if (error) throw catchError("Error processing request")
    if (!wallet)
        throw catchError("You cannot perform this operation at this moment")
    if (Number(amount) > Number(wallet.balance))
        throw catchError("Insufficient balance")

    await new TransactionService({}).create(
        composeTransactionDoc({
            wallet,
            amount,
            status: params.pendingTransaction
                ? TRANSACTION_STATUS.PENDING
                : TRANSACTION_STATUS.SUCCESSFUL,
            meta: params.transactionMeta,
        }),
        session
    )
    const [currentWallet] = await Promise.all([
        new WalletService({ _id: wallet._id }).update(
            { balance: Number(wallet.balance) - Number(amount) },
            session
        ),
    ])

    return { currentWallet }
}

type CreditProps = {
    userId: string
    session: ClientSession
    amount: number
    pendingTransaction: boolean
    transactionMeta?: Record<string, any>
    name: string
    type: "main-wallet" | "coin-wallet"
}

export const creditWallet = async (params: CreditProps) => {
    const { userId, session, amount, type, name } = params
    const [wallet, error] = await tryPromise(getWallet(userId, name, type))

    if (error) throw catchError("Error processing request")
    if (!wallet)
        throw catchError("You cannot perform this operation at this moment")

    const transaction = await new TransactionService({}).create(
        composeTransactionDoc({
            wallet,
            amount,
            type: 'credit',
            status: params.pendingTransaction
                ? TRANSACTION_STATUS.PENDING
                : TRANSACTION_STATUS.SUCCESSFUL,
            meta: params.transactionMeta,
        }),
        session
    )
    const [currentWallet] = await Promise.all([
        new WalletService({ _id: wallet._id }).update(
            { balance: Number(wallet.balance) + Number(amount) },
            session
        ),
    ])

    return { currentWallet, transaction }
}
