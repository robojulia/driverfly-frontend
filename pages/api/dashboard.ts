import BaseApi from "./_baseApi";

export default class DashboardApi extends BaseApi {
  baseUrl: string = "dashboard";
  constructor() {
    super();
  }

  async getStatsForDriver() {
    const { data } = await this.get(`${this.baseUrl}/driver`);

    return data;
  }

}