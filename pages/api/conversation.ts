import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";
import { ConversationEntity, CreateConversationDto } from "../../models/conversation/conversation.entity";
import BaseApi from "./_baseApi";

export class ConversationApi extends BaseApi {
  private baseUrl = "conversations"

  async create(dto: CreateConversationDto) : Promise<ConversationEntity> {
    const { data } = await this.post(this.baseUrl, dto);

    return data;
  }
  async update(id: number, dto) : Promise<ConversationEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}`, dto);

    return data;
  }
  async remove(id: number) : Promise<void> {
    await this.delete(`${this.baseUrl}/${id}`);
  }
  async list() : Promise<ConversationEntity[]> {
    const { data } = await this.get(this.baseUrl);

    return data;
  }
  async markRead(id: number): Promise<ConversationEntity> {
    const { data } = await this.put(`${this.baseUrl}/${id}/read`, null)

    return data;
  }

  async getById(id: number) : Promise<ConversationEntity> { 
    const { data } = await this.get(`${this.baseUrl}/${id}`);

    return data;
  }

  messages = {

    baseUrl: (conversationId: number) => `${this.baseUrl}/${conversationId}/messages`,
    create: async (conversationId: number, dto: ConversationMessageEntity) : Promise<ConversationMessageEntity> => {
      const { data } = await this.post(this.messages.baseUrl(conversationId), dto);

      return data;
    },
    list: async (conversationId: number) : Promise<ConversationMessageEntity[]> => {
      const { data } = await this.get(this.messages.baseUrl(conversationId));

      return data;
    }

  }
}