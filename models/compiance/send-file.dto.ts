import * as yup from "yup";
export class SendFileDto {
    documentId?: number;

    applicantIds?: number[];
    static yupSchema() {
        return yup.object({
            documentId: yup.number().required().nullable(),
            applicantIds: yup.number().required().nullable(),
        });
    }
}
