import { JobApplicantDocumentType } from "../../enums/application/job-application-document-type.enum";

export interface ApplicantDocumentDto {
    /**
     * @ApiProperty
     * @enum {JobApplicantDocumentType}
     */
    type: JobApplicantDocumentType
    /**
     * @ApiProperty
     * @IsOptional
     */
    name?: string;
    /**
     * @ApiProperty
     * @IsOptional
     */
    description?: string;
    /**
     * @ApiProperty
     * @IsOptional
     */
    mime_type?: string;
    /**
     * @ApiProperty
     * @type {binary}
     */
    file_base64?: string;

}