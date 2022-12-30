import { AxiosRequestConfig } from "axios";
import * as https from "https";

export function DRIVOPS_30_LOWER_SSL_SECURITY_WORKAROUND() : AxiosRequestConfig {
    return {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    };
}