import { DocumentEntity } from '../documents/document.entity';

import * as yup from 'yup';
// import * as yup from "../../utils/yup";
import { VehicleType } from '../../enums/vehicles/vehicle-type.enum';
import { VehicleTrailerType } from '../../enums/vehicles/vehicle-trailer-type.enum';
import { VehicleAccessory } from '../../enums/vehicles/vehicle-accessory.enum';
import { Status } from '../../enums/status.enum';

export class VehicleEntity {
  id?: number;
  version?: number;
  status?: string = Status.ACTIVE;
  type?: VehicleType;
  type_other?: string;
  trailer_type?: string;
  trailer_type_other?: string;
  transmission_type?: string;
  make?: string;
  model?: string;
  year?: number;
  photo?: DocumentEntity = null;
  registration_document?: DocumentEntity = null;
  insurance_document?: DocumentEntity = null;
  title_document?: DocumentEntity = null;
  lease_agreement_document?: DocumentEntity = null;
  accessories?: string[] = [];
  accessory_other?: string;
  is_governed?: boolean = false;
  is_public?: boolean = false;
  public_token?: string;
  max_speed?: number;
  vin?: string;
  unit_number?: string;
  tire_size?: string;
  odometer?: number;
  other_details?: string;
  created_at: string | Date;
  current_employee_id?: number;
  last_updated_at?: string | Date;
  registration_expiration_date?: string | Date;
  inspections?: any[];
  maintenance_reports?: any[];
  repairs?: any[];

  static yupSchema() {
    return yup.object({
      type: (yup.string() as any).enum(VehicleType).required().nullable(),
      type_other: yup
        .string()
        .when('type', {
          is: (type) => type == VehicleType.OTHER,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      trailer_type: (yup.string() as any).enum(VehicleTrailerType).nullable(),
      trailer_type_other: yup
        .string()
        .when('trailer_type', {
          is: VehicleTrailerType.OTHER,
          then: yup.string().required().nullable(),
        })
        .nullable(),
      transmission_type: yup.string().nullable(),
      make: yup.string().required().nullable().trim(),
      model: yup.string().nullable(),
      year: yup
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 1, 'Year cannot be in the future')
        .nullable(),
      photo: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema()
            .test('supportedImageTypes', 'INVALID_IMAGE_TYPE', (value: any) => {
              return (
                !value?.mime_type ||
                ['image/jpeg', 'image/png', 'image/gif'].includes(value?.mime_type)
              );
            })
            .test('fileSize', 'FILE_TOO_LARGE', (value: any) => {
              return !value?.size || value.size <= 2097152; // 2MB in bytes
            })
            .nullable(),
        })
        .optional(),
      registration_document: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema()
            .test('supportedDocTypes', 'INVALID_DOCUMENT_TYPE', (value: any) => {
              return (
                !value?.mime_type ||
                ['application/pdf', 'image/jpeg', 'image/png'].includes(value?.mime_type)
              );
            })
            .nullable(),
        })
        .optional(),
      insurance_document: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema()
            .test('supportedDocTypes', 'INVALID_DOCUMENT_TYPE', (value: any) => {
              return (
                !value?.mime_type ||
                ['application/pdf', 'image/jpeg', 'image/png'].includes(value?.mime_type)
              );
            })
            .nullable(),
        })
        .optional(),
      title_document: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema()
            .test('supportedDocTypes', 'INVALID_DOCUMENT_TYPE', (value: any) => {
              return (
                !value?.mime_type ||
                ['application/pdf', 'image/jpeg', 'image/png'].includes(value?.mime_type)
              );
            })
            .nullable(),
        })
        .optional(),
      lease_agreement_document: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema()
            .test('supportedDocTypes', 'INVALID_DOCUMENT_TYPE', (value: any) => {
              return (
                !value?.mime_type ||
                ['application/pdf', 'image/jpeg', 'image/png'].includes(value?.mime_type)
              );
            })
            .nullable(),
        })
        .optional(),
      accessories: yup
        .array((yup.string() as any).enum(VehicleAccessory))
        .nullable()
        .optional()
        .notRequired(),
      accessory_other: yup
        .string()
        .when('accessories', {
          is: (v) => v?.includes(VehicleAccessory.OTHER),
          then: yup.string().required().nullable(),
        })
        .nullable(),
      is_governed: yup.boolean().required().nullable(),
      is_public: yup.boolean().required().nullable(),
      max_speed: yup
        .number()
        .min(0)
        .max(200, 'Speed cannot exceed 200 mph')
        .when('is_governed', {
          is: true,
          then: yup.number().min(0).max(200, 'Speed cannot exceed 200 mph').required().nullable(),
          otherwise: yup
            .number()
            .min(0)
            .max(200, 'Speed cannot exceed 200 mph')
            .optional()
            .nullable(),
        }),
      vin: yup.string().max(17).nullable(),
      unit_number: yup.string().nullable(),
      tire_size: yup.string().nullable(),
      odometer: yup.number().min(0).nullable(),
      other_details: yup.string().nullable(),
      status: yup.string().nullable(),
      registration_expiration_date: yup.date().nullable(),
    });
  }
}
