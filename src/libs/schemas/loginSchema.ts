import { object, string } from 'yup';

export const loginSchema = object({
    email: string()
        .email("Введите корректный Email")
        .required("Поле обязательно"),
    password: string()
        .required("Поле обязательно")
}); 