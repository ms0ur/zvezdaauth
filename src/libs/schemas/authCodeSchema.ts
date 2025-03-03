import { object, string } from 'yup';

export const authCodeSchema = object({
    code: string()
        .required("Поле обязательно")
});