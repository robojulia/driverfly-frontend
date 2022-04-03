import BaseApi from "./_baseApi";

import { DocumentEntity } from "../../models/documents/DocumentEntity";

export default class UserApi extends BaseApi {
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
        })

        return data as DocumentEntity[];
    }

    async putUser(userId, user) {
        const { data } = await this.put(`user/${userId}`, user);

        return data.user;
    }
}
