import { object, string, ref } from 'yup';

export const registerSchema = object({
    email: string()
        .email("Введите корректный Email")
        .required("Поле обязательно"),
    password: string()
        .min(6, "Пароль должен быть длиннее 6 символов")
        .required("Поле обязательно"),
    repeatPassword: string()
        .oneOf([ref("password")], "Пароли не совпадают")
        .required("Поле обязательно")
}); 