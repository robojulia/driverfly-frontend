import * as yup from "yup";

export class BasicEntity {
    id?: number;

    static yupSchema() {
        return yup.object({
            id: yup.mixed().when({
                is: v => v == "",
                then: yup.string().required().nullable()
            }).required().nullable()
        })
    }
}