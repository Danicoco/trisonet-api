/** @format */

import axios from "axios"
import { catchError, createReference, snakeToCamel } from "../common/utils"
import {
    ISarepayBankResponse,
    ISarepayValidateResponse,
    ISarepayVirtualResponse,
} from "../../types"
import { configs } from "../common/utils/config"

class Sarepay {
    private http = () =>
        axios.create({
            baseURL: configs.SAREPAY_BASEURL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                "api-key": configs.SAREPAY_API_KEY,
                Accept: "application/json",
            },
        })
        
    constructor() {}

    public async createReserveAccount(
        payload: Record<string, any>
    ): Promise<ISarepayVirtualResponse | undefined> {
        const body = {
            first_name: payload.firstName,
            last_name: payload.lastName,
            other_name: payload.otherName,
            bvn: payload.bvn || payload.nin,
            dob: payload.dob,
            phone_number: payload.phoneNumber,
            business_type: "Main",
            type: "Personal",
            currency: "NGN",
        }

        const { data } = await this.http()
            .post("/virtual-accounts/permanents", body)
            .catch((e: any) => {
                console.error(e.response?.data)
                throw catchError(e.response?.data.message)
            })

        if (data.data) {
            return this.handleResponse(data.data)
        }
    }

    private handleResponse (data: Record<string, any>) {
        let result: any = {};
        if (data) {
            Object.keys(data).forEach(d => {
                result[snakeToCamel(d)] =  data[d]
            })
        }

        return result
    }

    public async getBanks(): Promise<ISarepayBankResponse[] | undefined> {
        const { data } = await this.http()
            .get("/disbursement/banks")
            .catch((e: any) => {
                throw catchError(e.response?.data.message)
            })

        if (data.data) {
            return data.data
        }
    }

    public async validateAccount(
        payload: Record<string, string>
    ): Promise<ISarepayValidateResponse | undefined> {
        const body = {
            account_number: payload.accountNumber,
            bank_code: payload.bankCode,
        }
        const { data } = await this.http()
            .post("/disbursement/accounts/validate", body)
            .catch((e: any) => {
                throw catchError(e.response?.data.message)
            })

        if (data.data) {
            return this.handleResponse(data.data)
        }
    }

    public async transfer(
        payload: Record<string, string>
    ): Promise<{} | undefined> {
        const body = {
            customer_reference: createReference('SR-TRANS'),
            account_number: payload.accountNumber,
            bank_code: payload.bankCode,
            amount: payload.amount,
            narration: payload.naration,
            recipient_name: payload.accountName,
        }
        const { data } = await this.http()
            .post("/disbursement/transact", body)
            .catch((e: any) => {
                throw catchError(e.response?.data.message)
            })

        if (data.data) {
            return this.handleResponse(data.data)
        }
    }

    public async verifyTransaction(
        id: string
    ): Promise<{} | undefined> {
        const { data } = await this.http()
            .get(`/disbursement/requery/${id}`)
            .catch((e: any) => {
                throw catchError(e.response?.data.message)
            })

        if (data.data) {
            return this.handleResponse(data.data)
        }
    }
}

export default Sarepay;
