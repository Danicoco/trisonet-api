/** @format */

import axios from "axios"
import { configs } from "../common/utils/config"
import { catchError, generateRandomDigit } from "../common/utils"
import { IElectrity } from "../../types"

class VTU {
    private http = (token?: string) =>
        axios.create({
            baseURL: configs.VTU_URL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                Authentication: token,
                Accept: "application/json",
            },
        })

    constructor() {}

    private async token() {
        const param = {
            username: configs.VTU_USERNAME,
            password: configs.VTU_PASSWORD,
        }
        const { data } = await this.http().post("/jwt-auth/v1/token", param)
        return data
    }

    public async getBalance() {
        const token = await this.token()
        const { data } = await this.http(token).get("/api/v2/balance")
        return data
    }

    public async getAirtimeVTU() {
        return [
            { label: "MTN", value: "mtn" },
            { label: "Glo", value: "glo" },
            { label: "Airtel", value: "airtel" },
            { label: "9mobile", value: "9mobile" },
        ]
    }

    public async purchaseAirtimeVTU(
        phone: string,
        network: string,
        amount: number
    ) {
        const payload = {
            phone,
            service_id: network,
            amount,
        }
        const { data } = await this.http()
            .get(
                `/api/v1/airtime?username=${configs.VTU_USERNAME}&password=${configs.VTU_PASSWORD}&phone=${payload.phone}&network_id=${payload.service_id}&amount=${payload.amount}`
            )
            .catch(e => {
                console.log(e);
                throw e
            })

        if (!data) {
            throw catchError("An error occured", 400);
        }
        return data
    }

    public async getDataVariation(network: string) {
        const dataPlans = [
            {
                variationId: 5506674,
                network: "MTN",
                data: "1GB + 1.5 mins",
                validity: "1 Day",
                price: 499,
            },
            {
                variationId: 2676,
                network: "MTN",
                data: "1GB + 5 mins",
                validity: "7 Days",
                price: 799,
            },
            {
                variationId: 244542,
                network: "MTN",
                data: "2GB + 2 mins",
                validity: "30 Days",
                price: 1499,
            },
            {
                variationId: 5506738,
                network: "MTN",
                data: "3.5GB + 5 mins",
                validity: "30 Days",
                price: 2499,
            },
            {
                variationId: 244538,
                network: "MTN",
                data: "7GB",
                validity: "30 Days",
                price: 3499,
            },
            {
                variationId: 2677,
                network: "MTN",
                data: "10GB + 10 mins",
                validity: "30 Days",
                price: 4499,
            },
            {
                variationId: 244540,
                network: "MTN",
                data: "16.5GB",
                validity: "30 Days",
                price: 6499,
            },
            {
                variationId: 2673,
                network: "MTN",
                data: "36GB",
                validity: "30 Days",
                price: 10999,
            },
            {
                variationId: 2667,
                network: "MTN",
                data: "75GB",
                validity: "30 Days",
                price: 17999,
            },

            {
                variationId: 5580758,
                network: "Glo",
                data: "125MB",
                validity: "1 Day",
                price: 99,
            },
            {
                variationId: 2251529,
                network: "Glo",
                data: "500MB (SME)",
                validity: "30 Days",
                price: 259,
            },
            {
                variationId: 2666,
                network: "Glo",
                data: "1.5GB",
                validity: "14 Days",
                price: 499,
            },
            {
                variationId: 5580757,
                network: "Glo",
                data: "1.75GB",
                validity: "Sunday",
                price: 199,
            },
            {
                variationId: 244659,
                network: "Glo",
                data: "2.2GB",
                validity: "Weekend",
                price: 499,
            },
            {
                variationId: 2660,
                network: "Glo",
                data: "2.6GB",
                validity: "30 Days",
                price: 999,
            },
            {
                variationId: 244658,
                network: "Glo",
                data: "5GB",
                validity: "30 Days",
                price: 1499,
            },
            {
                variationId: 244668,
                network: "Glo",
                data: "7.5GB",
                validity: "30 Days",
                price: 2499,
            },
            {
                variationId: 2665,
                network: "Glo",
                data: "11GB",
                validity: "30 Days",
                price: 2999,
            },
            {
                variationId: 2663,
                network: "Glo",
                data: "18GB",
                validity: "30 Days",
                price: 4999,
            },
            {
                variationId: 2661,
                network: "Glo",
                data: "40GB",
                validity: "30 Days",
                price: 9999,
            },
            {
                variationId: 2251528,
                network: "Glo",
                data: "1GB (SME)",
                validity: "30 Days",
                price: 449,
            },
            {
                variationId: 2251526,
                network: "Glo",
                data: "2GB (SME)",
                validity: "30 Days",
                price: 899,
            },
            {
                variationId: 2251525,
                network: "Glo",
                data: "3GB (SME)",
                validity: "30 Days",
                price: -0,
            },
            {
                variationId: 2251523,
                network: "Glo",
                data: "5GB (SME)",
                validity: "30 Days",
                price: 2249,
            },
            {
                variationId: 2251521,
                network: "Glo",
                data: "10GB (SME)",
                validity: "30 Days",
                price: 4499,
            },

            {
                variationId: 244698,
                network: "Airtel",
                data: "1GB",
                validity: "7 Days",
                price: 799,
            },
            {
                variationId: 2672,
                network: "Airtel",
                data: "2GB",
                validity: "30 Days",
                price: 1499,
            },
            {
                variationId: 244721,
                network: "Airtel",
                data: "3GB",
                validity: "30 Days",
                price: 1999,
            },
            {
                variationId: 2675,
                network: "Airtel",
                data: "6GB",
                validity: "30 Days",
                price: 2999,
            },
            {
                variationId: 2674,
                network: "Airtel",
                data: "10GB",
                validity: "30 Days",
                price: 3999,
            },
            {
                variationId: 2670,
                network: "Airtel",
                data: "18GB",
                validity: "30 Days",
                price: 5999,
            },
            {
                variationId: 2669,
                network: "Airtel",
                data: "35GB",
                validity: "30 Days",
                price: 9999,
            },
            {
                variationId: 2668,
                network: "Airtel",
                data: "60GB",
                validity: "30 Days",
                price: 14999,
            },

            {
                variationId: 2664,
                network: "9mobile",
                data: "1.4GB",
                validity: "30 Days",
                price: 1199,
            },
            {
                variationId: 2787,
                network: "9mobile",
                data: "2.44GB",
                validity: "30 Days",
                price: 1999,
            },
            {
                variationId: 2662,
                network: "9mobile",
                data: "3.91GB",
                validity: "30 Days",
                price: 2999,
            },
            {
                variationId: 2793,
                network: "9mobile",
                data: "5.10GB",
                validity: "30 Days",
                price: 3999,
            },
            {
                variationId: 2792,
                network: "9mobile",
                data: "16GB",
                validity: "30 Days",
                price: 11999,
            },
            {
                variationId: 2791,
                network: "9mobile",
                data: "78GB",
                validity: "90 Days",
                price: 59999,
            },
        ]

        const plans =
            dataPlans.filter(plan => {
                return plan.network.toLowerCase() === network.toLowerCase()
            }) || []

        return plans.map(plan => ({ ...plan, price: Number(plan.price) + 1 }))
    }

    public async purchaseDataVTU(
        phone: string,
        network: string,
        variation_id: string
    ) {
        const payload = {
            request_id: generateRandomDigit(100000, 9999999),
            phone,
            service_id: network,
            variation_id,
        }

        const { data } = await this.http()
            .get(
                `/api/v1/data?username=${configs.VTU_USERNAME}&password=${
                    configs.VTU_PASSWORD
                }&phone=${payload.phone}&network_id=${
                    payload.service_id === "9mobile"
                        ? "etisalat"
                        : payload.service_id.toLowerCase()
                }&variation_id=${payload.variation_id}`
            )
            .catch(e => {
                throw e
            })

            if (!data) {
                throw catchError("An error occured", 400);
            }

        return data
    }

    public async verifyCustomer(
        meterNumber: string,
        service: string,
        variation_id: string
    ) {
        const payload = {
            service_id: service,
            customer_id: meterNumber,
            variation_id,
        }
        const { data } = await this.http().get(
            `/api/v1/verify-customer?username=${configs.VTU_USERNAME}&password=${configs.VTU_PASSWORD}&customer_id=${payload.customer_id}&service_id=${payload.service_id}&variation_id=${payload.variation_id}`
        ) .catch(e => {
            console.log(e);
            throw e
        })

        if (!data) {
            throw catchError("An error occured", 400);
        }

        return data
    }

    public async purchaseElectricity(payload: IElectrity) {
        const { data } = await this.http().get(
            `/api/v1/electricity?username=${configs.VTU_USERNAME}&password=${configs.VTU_PASSWORD}&phone=${payload.phone}&meter_number=${payload.customer_id}&service_id=${payload.service_id}&variation_id=${payload.variation_id}&amount=${payload.amount}`
        ) .catch(e => {
            console.log(e);
            throw e
        })

        if (!data) {
            throw catchError("There's an issue on our end. Please try again", 400);
        }

        return data
    }
}

export default VTU
