import BaseApi from "./_baseApi";
export default class MapboxApi extends BaseApi {
  constructor() {
    super();
  }

  async forwardGeocoding(query: string, endpoint = "mapbox.places") {
    // coordinates to specify the location of
    const bbox = "-124.482003,24.7433195,-67.444574,48.9175845";
    const baseUrl = `https://api.mapbox.com/geocoding/v5/${endpoint}/${query}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&bbox=${bbox}`
    const { data } = await this.get(baseUrl);
    return data;
  }

  async reverseGeocoding(longitude: number | string, latitude: number | string, endpoint = "mapbox.places") {
    const baseUrl = `https://api.mapbox.com/geocoding/v5/${endpoint}/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    const { data } = await this.get(baseUrl);
    return data;
  }
}