import * as yup from "yup";
import "../../../../utils/yup";

export class AccordianExtras{
    name: string;
    employer_name: string;
    cdl_license_number: string;
    expiration_date: string | Date;

    static yupSchema(){
        return yup.object({
            name: yup.string().optional().nullable(),
            employer_name: yup.string().optional().nullable(),
            cdl_license_number: yup.string().optional().nullable(),
            expiration_date: yup.date().optional().nullable(),
        });
    }
}