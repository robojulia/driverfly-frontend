import { EducationLevel } from "../../enums/users/education-level.enum";
import { ApplicantDocumentDto } from "./application-document.dto";

export interface ApplyJobDto {

    /**
     * @IsNotEmpty
     */
    first_name?: string;

    /**
     * @IsNotEmpty
     */
    last_name?: string;

    /**
     * @IsNotEmpty
     */
    phone?: string;

    /**
     * @IsNotEmpty
     */
    email?: string;

    /**
     * @IsOptional
     */
    years_cdl_experience?: number;

    /**
     * @IsOptional
     */
    can_pass_drug_test?: boolean;

    /**
     * @IsOptional
     * @enum {EducationLevel}
     */
    highest_degree?: string;

    /**
     * @IsOptional
     */
    accident_count?: number;

    /**
     * @IsOptional
     * @IsArray
     */
    documents?: ApplicantDocumentDto;
}
