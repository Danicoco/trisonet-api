/** @format */

import { catchError } from "./index"

export const validateEnvs = (values: string[]) => {
    return values.map(value => {
        if (typeof process.env[value] !== "string") {
            throw catchError(`Add ${value} to env`)
        }
        return value
    })
}

const getEnv = (key: string) => String(process.env[key])

export const configs = {
    PORT: getEnv("PORT"),
    DB_URL: getEnv("DB_URL"),
    DB_NAME: getEnv("DB_NAME"),
    NODE_ENV: getEnv("NODE_ENV"),
    DB_URL_PROD: getEnv("DB_URL_PROD"),
    BACKEND_URL: getEnv("BACKEND_URL"),
    SAREPAY_BASEURL: getEnv("SAREPAY_BASEURL"),
    SAREPAY_API_KEY: getEnv("SAREPAY_API_KEY"),
    DB_NAME_PROD: getEnv("DB_NAME_PROD"),
    ENCRYPTIONIV: getEnv("ENCRYPTIONIV"),
    ENCRYPTIONKEY: getEnv("ENCRYPTIONKEY"),
    SUBSCRIPTION_FEE: getEnv("SUBSCRIPTION_FEE"),
    TERMII_URL: getEnv("TERMII_URL"),
    TERMII_API_KEY: getEnv("TERMII_API_KEY"),
    TERMII_SENDER_ID: getEnv("TERMII_SENDER_ID"),
    ZEP_URL: getEnv("ZEP_URL"),
    ZEP_TOKEN: getEnv("ZEP_TOKEN"),
    VTU_URL: getEnv("VTU_URL"),
    VTU_USERNAME: getEnv("VTU_USERNAME"),
    VTU_PASSWORD: getEnv("VTU_PASSWORD"),
}

validateEnvs(Object.keys(configs))
