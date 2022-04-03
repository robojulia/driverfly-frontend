import { DriverEntity } from "../../models/driver/Driver.entity";
import { DriverPreferenceEntity } from "../../models/driver/DriverPreference.entity";
import BaseApi from "./_baseApi";

export default class DriverApi extends BaseApi {
    async getDriver(): Promise<DriverEntity> {
        const { data } = await this.get("drivers");

        return data;
    }

    async postDriver(driver) {
        const { data } = await this.post("drivers", driver);

        return data;
    }

    async getPreferences(): Promise<DriverPreferenceEntity[]> {
        const { data } = await this.get("drivers/preferences");

        return data;
    }

    async postPreference(preference) {
        const { data } = await this.post("drivers/preferences", preference);

        return data;

    }
}
