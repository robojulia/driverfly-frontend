import * as yup from "yup";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";

export class CompanyPreferencesEntity {

    jotform_url: string;
    cdl_class: DriverLicenseType;

    static yupSchema() {
        return yup.object({
            jotform_url: yup.string().trim().required().nullable(),
            cdl_class: yup.array((yup.string() as any).enum(DriverLicenseType)).nullable()


        });
    }
}
