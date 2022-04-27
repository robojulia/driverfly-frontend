import { DriverDegree } from "../../enums/drivers/driver-degree.enum";

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
     * @enum {DriverDegree}
     */
    highest_degree?: string;

    /**
     * @IsOptional
     */
    accident_count?: number;

    /**
     * @IsOptional
     */
    resume?: File;

    /**
     * @IsOptional
     */
    drivers_license?: File;

    /**
     * @IsOptional
     */
    medical_card?: File;

}
