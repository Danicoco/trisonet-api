/** @format */

import axios from "axios"
import { configs } from "../common/utils/config"

class Termii {
    private http = () =>
        axios.create({
            baseURL: configs.TERMII_URL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })

    constructor() {}

    public async Send(to: string, message: string) {
        const payload = {
            to,
            sms: message,
            api_key: configs.TERMII_API_KEY,
            channel: "dnd",
            from: 'N-Alert',
            // configs.TERMII_SENDER_ID,
            type: "plain",
        }
        const { data } = await this.http().post("/sms/send", payload, {
            headers: { "Content-Type": "application/json" },
        })

        console.log({ smsResponse: data })

        return data
    }
}

export default Termii
