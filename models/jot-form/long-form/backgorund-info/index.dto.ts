import * as yup from "yup";
import "../../../../utils/yup";

export class BackgroundInfoLineAddress {
  address_1: string;
  address_2?: string;

  static yupSchema() {
    return yup.object({
      address_1: yup.string().required().nullable(),
      address_2: yup.string().optional().nullable(),
    });
  }
}
