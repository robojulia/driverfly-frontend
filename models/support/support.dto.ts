import * as yup from "yup";
import { CompanyEntity } from "../company/company.entity";
import { UserEntity } from "../user/user.entity";
import { DocumentEntity } from "../documents/document.entity";
import { DocumentVisibility } from "../../enums/documents/document-visibility.enum";

export class SupportDto {
    description: string;
    operating_system: string;
    page_path_url: string;

    company?: CompanyEntity;
    user?: UserEntity;
    documents?: DocumentEntity[];

    static yupSchema() {
        return yup.object({
            description: yup.string().required().nullable(),
            operating_system: yup.string().required().nullable(),
            page_path_url: yup.string().required().nullable(),
            documents:
                // yup
                //     .array(
                //         yup
                //             .object({
                //                 type: yup.string().optional().nullable(),
                //                 visibility: (yup.string() as any)
                //                     .enum(DocumentVisibility)
                //                     .nullable(),
                //                 name: yup.string().optional().nullable(),
                //                 description: yup.string().nullable(),
                //                 mime_type: yup.string().nullable(),
                //                 file_base64: yup.string().optional().nullable(),
                //             })
                //             .optional()
                //             .nullable()
                //     )
                //     .min(0)
                //     .optional()
                //     .nullable(),

                (
                    yup.array(DocumentEntity.yupSchema()) as any
                )
        });
    }
}
