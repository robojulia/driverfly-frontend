import { FbLeadsDto } from "../../models/fb-leads.dto";
import BaseApi from "./_baseApi";
export default class FbLeadsApi extends BaseApi {
    constructor() {
        super();
    }

    async fbLeads(dto: FbLeadsDto, endpoint = "leadgen_forms", pageid= "110807565182912") {
        const baseUrl = `https://graph.facebook.com/v12.0/${pageid}/${endpoint}/?access_token="EAAHlZARPsiaEBAHxtEZBQHl51928ZB0Ts40sHClZBpCWNnCHdkL5YvYlLEfuGsCSdF2UUDdXHJxP0AEsmeuidRQZBqzxhqLLO15H39bJdlLx5Y3N0oPfBmr4w3yDybyGVlvKrdlMdK070BLVTgqf896l6JdqI5zwANmLMhzMWEEL5AHi0LCzkaV7QnJZANAPVZAx8RGvvqGgM6ZAnFtUOlpY"&autocomplete=true`
        const { data } = await this.post(baseUrl, dto);
        return data;
    }  
    
}