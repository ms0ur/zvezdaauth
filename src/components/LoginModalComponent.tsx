import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeButtonComponent from './EyeButtonComponent.tsx';
import './LoginModalComponent.css';
import { object, string } from 'yup';
import AxiosInstance from "../AxiosInstance.ts";

const loginSchema = object({
    email: string()
        .email("Введите корректный Email")
        .required("Поле обязательно"),
    password: string()
        .required("Поле обязательно")
});

export default function LoginModalComponent() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const [showPass, setShowPass] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            const res = await AxiosInstance.post('/access/login', {
                username: data.email,
                password: data.password
            });

            if (res.status === 200) {
                const { access_token, refresh_token } = res.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="ModalBackground">
            <form className="ModalWindow" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="ModalTitle rubik-700">Вход по почте</h2>
                <div className="ModalGroupInput">
                    <div className="ModalInput">
                        <input
                            {...register("email")}
                            className="ModalInputPole"
                            type="text"
                            placeholder="E-mail"
                        />
                        {errors.email && (
                            <p className="ModalInputError rubik-400">
                                {errors.email.message}
                            </p>
                        )}
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
                        {errors.password && (
                            <p className="ModalInputError rubik-400">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="ModalGroupMainButton">
                    <button className="ModalMainButton rubik-400" type="submit">
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}
