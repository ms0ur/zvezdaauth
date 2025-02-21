import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeButtonComponent from './EyeButtonComponent';
import './RegisterModalComponent.css';
import { object, string, ref } from 'yup';

import AxiosInstance from "../AxiosInstance";

interface RegisterFormValues {
    email: string;
    password: string;
    repeatPassword: string;
}

const registerSchema = object({
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

interface RegisterSuccessfulResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
}

export default function RegisterModalComponent() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema)
    });

    const [showPass, setShowPass] = useState(false);
    const [showRepeatPass, setShowRepeatPass] = useState(false);

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        const preparedData = {
            email: data.email,
            password: data.password
        };

        try {
            const res = await AxiosInstance.post("/access/register", preparedData);
            if (res.status === 200) {
                const { access_token, refresh_token } = res.data as RegisterSuccessfulResponse;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
            }
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
        }
    };

    return (
        <div className="ModalBackground">
            <form className="ModalWindow" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="ModalTitle rubik-700">Регистрация по почте</h2>
                <div className="ModalGroupInput">
                    <div className="ModalInput">
                        <input
                            {...register("email")}
                            className="ModalInputPole"
                            type="email"
                            placeholder="E-mail"
                        />
                        {errors.email && <p className="ModalInputError rubik-400">{errors.email.message}</p>}
                    </div>
                    <div className="ModalInput">
                        <input
                            {...register("password")}
                            className="ModalInputPole"
                            type={showPass ? "text" : "password"}
                            placeholder="Пароль"
                        />
                        <div className="ModalInputEye">
                            <EyeButtonComponent show={showPass} setShow={setShowPass} />
                        </div>
                        {errors.password && <p className="ModalInputError rubik-400">{errors.password.message}</p>}
                    </div>
                    <div className="ModalInput">
                        <input
                            {...register("repeatPassword")}
                            className="ModalInputPole"
                            type={showRepeatPass ? "text" : "password"}
                            placeholder="Повторите пароль"
                        />
                        <div className="ModalInputEye">
                            <EyeButtonComponent show={showRepeatPass} setShow={setShowRepeatPass} />
                        </div>
                        {errors.repeatPassword && <p className="ModalInputError rubik-400">{errors.repeatPassword.message}</p>}
                    </div>
                </div>
                <div className="ModalGroupMainButton">
                    <button className="ModalMainButton rubik-400" type="submit">
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </div>
    );
}
