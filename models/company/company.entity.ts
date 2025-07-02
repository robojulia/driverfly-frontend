import * as yup from 'yup';
import { Status } from '../../enums/status.enum';
import { DocumentEntity } from '../documents/document.entity';
import { UserEntity } from '../user/user.entity';

export class CompanyEntity {
  id?: number;
  name?: string;
  about?: string;
  website?: string;
  photo?: DocumentEntity;
  status?: Status;
  uuid_token?: string;
  slug?: string;
  location?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;

  // Company context fields for enhanced candidate communication
  fleet_size?: string;
  founded_year?: number;
  safety_rating?: string;
  company_culture?: string;
  company_benefits?: string;
  specialties?: string[];

  users?: UserEntity[];
  parent?: CompanyEntity;
  children?: CompanyEntity[];

  static yupSchema(t: (key: string) => string) {
    return yup.object({
      name: yup.string().required().nullable().max(100).trim(),
      about: yup
        .string()
        .nullable()
        .max(750)
        .test({
          test: (value, context) => {
            const regex_number = `[0-9]{7,12}`;
            let result = value?.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/g);

            if (!result && !!!value?.match(regex_number)) return true;
            return context.createError({
              path: context.path,
              message: t('NO_EMAIL_AND_NUMBER'),
            });
          },
        }),
      website: yup.string().url().nullable(),

      phone: yup.string().nullable(),
      location: yup.string().optional().nullable(),
      facebook: yup.string().url().nullable(),
      instagram: yup.string().url().nullable(),
      linkedin: yup.string().url().nullable(),
      twitter: yup.string().url().nullable(),

      // Company context fields for enhanced candidate communication
      fleet_size: yup.string().nullable().max(100),
      founded_year: yup.number().nullable().min(1800).max(new Date().getFullYear()),
      safety_rating: yup.string().nullable().max(255),
      company_culture: yup.string().nullable().max(1000),
      company_benefits: yup.string().nullable().max(1000),
      specialties: yup.array().of(yup.string()).nullable(),

      photo: yup
        .mixed()
        .when({
          is: (v) => !!v,
          then: DocumentEntity.yupSchema(),
        })
        .optional(),
    });
  }
}
