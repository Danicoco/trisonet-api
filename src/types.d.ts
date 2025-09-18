/** @format */

import { Request } from "express"
import { PopulateOptions } from "mongoose"

interface DefaultAttributes {
    _id?: string
    deletedAt?: string
    createdAt?: string
    updatedAt?: string
}

interface IUser extends DefaultAttributes {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    nin: string
    dateOfBirth: Date
    pim: string
    password: string
    verifiedAt: Date
    otp: string
    isActive: boolean
    avatar: string
    numberOfFollowers: number
    numberOfFollowing: number
    delivery: {
        address: string
        phoneNumber: string
    }
}

interface IAdmin extends DefaultAttributes {
    name: string
    email: string
    password: string
    role: "super-admin" | "marketplace"
}

interface IFollow extends DefaultAttributes {
    user: string
    following: string
    dateFollowed: Date
}

interface IPost extends DefaultAttributes {
    post: string
    description: string
    numberOfReplies: number
    numberOfLikes: number
    attachments: string[]
    user: {
        _id: string
        firstName: string
        lastName: string
        avatar: string
    }
}

interface IPostLike extends DefaultAttributes {
    post: string
    user: string
    postCreator: string
}

interface IDM extends DefaultAttributes {
    user: string
    sender: string
    roomId: string;
    lastMessage: string
    dateOfLastMessage: Date
    unread?: {
        sender: number;
        user: number
    }
}

interface IChat extends DefaultAttributes {
    roomId: string
    message: string
    sender: string
    receiver: string
    delievered: boolean
    seen: boolean
    replyTo?: string;
    removed?: {
        deleteBy: { _id: string; name: string };
        date: Date;
    }
}

interface ICommunityChat extends DefaultAttributes {
    roomId: string
    message: string
    sender: string
    community: string
    readBy: string[]
    replyTo?: string;
    removed?: {
        deleteBy: { _id: string; name: string };
        date: Date;
    }
}

interface INotification extends DefaultAttributes {
    user: string
    post: string
    action: string
    section: "like" | "reply"
    createdBy: string
}

interface ICommunity extends DefaultAttributes {
    name: string
    description: string
    privacy: "public" | "private"
    avatar: string
    inviteLink: string
    numberOfParticipant: number
    user: string
    dateOfLastMessage: string
    lastMessage: string
}

interface ICommunityMember extends DefaultAttributes {
    user: string
    community: string
    status: "admin" | "member"
}

interface IWallet extends DefaultAttributes {
    balance: number
    user: string
    bank?: {
        accountNumber: string
        accountName: string
        bankName: string
    }
    type: "main-wallet" | "coin-wallet"
}

interface IMetaVerseProperties extends DefaultAttributes {
    type: "land" | "building" | "car"
    price: number
    dateAcquired: Date
    forSale: boolean
    sold: boolean
    dateSold?: Date
    isActive: boolean
    metaverse: string;
    user: string;
    admin?: string;
    meta: Record<string, any>
}

interface IMetaVerseEvent extends DefaultAttributes {
    isActive: boolean;
    amount: number;
    title: string;
    description: string;
    participant: { _id: string; name: string; }[]
    metaverse: string;
    user: string;
    location: string;
    endDate: string;
    startDate: string
    invitationCode: string;
}

interface IMetaVerseAsset extends DefaultAttributes {
    name: string;
    uniqueName: string;
    price: number;
    type: 'land' | 'building'
    meta: Record<string, any>
}

interface IMetaverse extends DefaultAttributes {
    avatar: string
    user: string;
}

type TransactionStatus = "pending" | "successful" | "failed"
type TransactionType = "credit" | "debit"

interface ITransaction extends DefaultAttributes {
    user: string
    fee: number
    amount: number
    wallet: string
    status: TransactionStatus
    type: TransactionType
    description: string
    reference: string
    currency: string
    wasReverted?: boolean
    wasRefunded?: boolean
    dateReverted?: Date
    dateRefunded?: Date
    dateInitiated: Date
    dateCompleted?: Date
    meta?: Record<string, any>
}

interface IPin extends DefaultAttributes {
    code: string
    user: string
    attemptLeft: number
    lastChangedAt: Date
}

interface ISubscription extends DefaultAttributes {
    user: string
    amountPaid: number
    type: "free" | "paid"
    isActive: boolean
    lastSubscriptionDate?: Date
}

interface IEvent extends DefaultAttributes {
    title: string
    description: string
    location: string
    date: string
    amount: number
    attachments: string[]
    admin: string
}

interface IHousing extends DefaultAttributes {
    title: string
    description: string
    restroom: string
    bed: string
    size: string
    agent: {
        name: string
        phoneNumber: string
    }
    location: string
    attachments: string[]
    admin: string
}

interface IFood extends DefaultAttributes {
    title: string
    description: string
    attachment: string
    price: number
    categories: string[]
    quantity: number
}

interface IOrder extends DefaultAttributes {
    totalPrice: number
    user: string
    status: "pending" | "delivered" | "canceled"
    delivery: {
        address: string
        phoneNumber: string
    }
    items: { foodId: string; quantity: number; price: number }[]
}

type ISarepayBankResponse = {
    code: string
    name: string
}

type ISarepayValidateResponse = {
    account_number: string
    account_name: string
}

type ISarepayVerifyTransReponse = {
    reference: string
    amount: string
    charge: string
    status: string
    recipient_name: string
    recipient_bank_code: string
    recipient_account_number: string
    processor_reference: string
    merchant_reference: string
}

type ISarepayVirtualResponse = {
    account_number: string
    account_name: string
    bank: string
    status: string
    expires_at: string
    validity_type: string
}

interface ISettlement extends DefaultAttributes {
    type: string
    meta: {
        customer_reference: string
        transaction_reference: string
        processorReference: string
        amount: string
        charge: string
        netAmount: string
        expectedAmount: string
        channel: string
        sender: {
            originatorBank: string
            originatorName: string
            originatorAccountNumber: string
        }
        recipient: string
        account_reference: string
        status: string
        createdAt: string
        updatedAt: string
        meta: { customerMeta: any[]; notification: any[] }
        customerMeta: []
        subaccount: []
    }
    status: ITransactionStatus
}

type IElectrity = {
    service_id: string,
    customer_id: string,
    variation_id: string,
    amount: number
    phone: string
}

interface IPaginator<T> {
    query?: T
    page: number
    limit: number
    select?: string
    populate?: PopulateOptions[] | PopulateOptions
}

type IPaginateResponse<T> = {
    docs: T[]
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
    hasMore: boolean
    totalDocs: number
    page: number
    totalPages: number
}

type CreateErr = (message: string, code?: number, validations?: object) => Error

type Token = IUser & { time: Date }

declare module "express-serve-static-core" {
    export interface Request {
        user: IUser
        admin: IAdmin
    }
}

type AppError = Error & {
    code: number
    name?: string
    message: string
    validations?: object | null
}

type Fix = any
