import BaseApi from "./_baseApi";

export class ConversationApi extends BaseApi {
    private baseUrl = "conversations"

    create(dto) { return this.post(this.baseUrl, dto); }
    update(id: number, dto) { return this.put(`${this.baseUrl}/${id}`, dto); }
    remove(id: number) { return this.delete(`${this.baseUrl}/${id}`)}
    list() { return this.get(this.baseUrl); }
    getById(id: number) { return this.get(`${this.baseUrl}/${id}`); }

    messages = {

        baseUrl: (conversationId: number) => `${this.baseUrl}/${conversationId}/messages`,
        create: async (conversationId: number, dto) => {
            const { data } = await this.post(this.messages.baseUrl(conversationId), dto);

            return data;
        },
        list: async (conversationId: number) => {
            const { data } = await this.get(this.messages.baseUrl(conversationId));

            return data;
        }

    }
}