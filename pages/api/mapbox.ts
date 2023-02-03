import BaseApi from "./_baseApi";
export default class MapboxApi extends BaseApi {
    constructor() {
        super();
    }

    async forwardGeocoding(query: string, endpoint = "mapbox.places") {
        const bbox = "-125.0011,24.9493,-66.9326,49.5904";
        const baseUrl = `https://api.mapbox.com/geocoding/v5/${endpoint}/${query}.json?access_token=${process.env.MAPBOX_API_KEY}&autocomplete=true&bbox=${bbox}`
        const { data } = await this.get(baseUrl);
        return data;
    }

    async reverseGeocoding(longitude: number | string, latitude: number | string, endpoint = "mapbox.places") {
        const baseUrl = `https://api.mapbox.com/geocoding/v5/${endpoint}/${longitude},${latitude}.json?access_token=${process.env.MAPBOX_API_KEY}`
        const { data } = await this.get(baseUrl);
        return data;
    }
}