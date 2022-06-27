import { DocumentEntity } from "../documents/document.entity";
import * as yup from "yup";
import { useTranslation } from "../../hooks/useTranslation";

export class CompanyEntity {

  name: string;
  about: string;
  website?: string;
  photo?: DocumentEntity;

  static yupSchema() {
    const { t } = useTranslation()
    return yup.object({
      name: yup.string().required().nullable(),
      about: yup.string().nullable()
        .test({
          test: (value, context) => {
            const regex_email = `([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)`
            const regex_number = `/^[-+]?[0-9]+$/`

            if (!value?.match(regex_email) && !!value?.match(regex_number)) return true;
            // if (!value?.match(regex_number)) return true;

            return context.createError({
              path: context.path,
              message: t('NO_EMAIL_AND_NUMBER')
            });
          }
        }),
      website: yup.string().url().nullable(),
      photo: yup.mixed().when({
        is: v => !!v,
        then: DocumentEntity.yupSchema()
      }).optional(),
    });
  }
}
