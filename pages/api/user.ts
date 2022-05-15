import BaseApi from "./_baseApi";

import { UserEntity } from "../../models/user/user.entity";
import { DocumentEntity } from "../../models/documents/document.entity";
import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";

export default class UserApi extends BaseApi {
    async getDocumentUrl(d: DocumentEntity): Promise<DocumentEntity> {
        const { data } = await this.get(`documents/${d.id}`);

        return data;
    }
    async getDocuments(): Promise<DocumentEntity[]> {
        const { data } = await this.get(`user/uploaded/documents`);

        return data as DocumentEntity[];
    }

    async deleteDocument(type: string): Promise<void> {
        await this.delete(`user/documents`, {
            type: type
        });
    }

    async postDocuments(formData: FormData): Promise<DocumentEntity[]> {
        const { data } = await this.post("user/documents", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data as DocumentEntity[];
    }

    async update(id: number, user: UserEntity) : Promise<UserEntity> {
        const { data } = await this.put(`user/${id}`, user);

        return data.user;
    }

    async putUser(userId, user) {
        const { data } = await this.put(`user/${userId}`, user);

        return data.user;
    }

    preferences = {
        baseUrl: (userId: number) => `user/${userId}/preferences`,
        list: async (userId: number, query: { category: UserPreferenceCategory, label: string }) : Promise<UserPreferenceEntity[]> => {
            const { data } = await this.get(this.buildUrl(this.preferences.baseUrl(userId), query));

            return data;
        },
        create: async (userId: number, dto: UserPreferenceEntity) : Promise<UserPreferenceEntity> => {
            const { data } = await this.post(this.preferences.baseUrl(userId), dto);

            return data;
        },
        update: async (userId: number, id: number, dto: UserPreferenceEntity) : Promise<UserPreferenceEntity> => {
            const { data } = await this.put(`${this.preferences.baseUrl(userId)}/${id}`, dto);

            return data;
        },
        remove: async (userId: number, id: number) : Promise<void> => {
            await this.delete(`${this.preferences.baseUrl(userId)}/${id}`);
        }
    }
}
