import BaseApi from "./_baseApi";

import { UserEntity } from "../../models/user/user.entity";
import { DocumentEntity } from "../../models/documents/document.entity";

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
}
