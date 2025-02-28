import { object, string, ref } from 'yup';

export const registerSchema = object({
    email: string()
        .email("Введите корректный Email")
        .required("Поле обязательно"),
    password: string()
        .min(6, "Пароль должен быть длиннее 6 символов")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]+$/, "Пароль должен содержать только латинские буквы, цифры и специальные символы")
        .matches(/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/, "Пароль должен содержать хотя бы один специальный символ")
        .required("Поле обязательно"),
    repeatPassword: string()
        .oneOf([ref("password")], "Пароли не совпадают")
        .required("Поле обязательно")
});
