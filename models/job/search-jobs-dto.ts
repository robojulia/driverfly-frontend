import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum";
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { JobSchedule } from "../../enums/jobs/job-schedule.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";
import { MvrType } from "../../enums/users/mvr-type.enum";

interface JobSearchExclude {
    jobId?: number
}

interface JobSearchLocation {
    lat?: string,
    long?: string,
    range?: string
}

export interface SearchJobsDto {

    exclude?: JobSearchExclude,

    companyId?: number,

    keywords?: string,

    cdl_class?: DriverLicenseType,

    areas_covered?: JobGeography,

    employment_type?: JobEmploymentType,

    delivery_type?: JobDeliveryType,

    equipment_type?: JobEquipmentType,

    transmission_type_experience?: VehicleTransmissionType,

    schedule?: JobSchedule,

    pay_structure?: JobPayMethod,

    endoresements_type?: DriverEndorsement,

    mvr_requirements?: MvrType,

    date_created?: Date | string,

    location?: JobSearchLocation,

    order_by?: string,

    take?: number,

    page?: number,

}
