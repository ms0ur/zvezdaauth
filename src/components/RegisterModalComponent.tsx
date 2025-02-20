import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeButtonComponent from './EyeButtonComponent.tsx';
import './RegisterModalComponent.css';
import { object, string, ref } from 'yup';

const registerSchema = object({
    email: string()
        .email("Введите корректный Email")
        .required("Поле обязательно"),
    password: string()
        .min(6, "Пароль должен быть длиннее 6 символов")
        .required("Поле обязательно"),
    repeatPassword: string()
        .oneOf([ref("password"), undefined], "Пароли не совпадают")
        .required("Поле обязательно")
});

export default function RegisterModalComponent() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const [showPass, setShowPass] = useState(false);
    const [showRepeatPass, setShowRepeatPass] = useState(false);

    const onSubmit = (data: any) => {
        console.log("valid: ", data);
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
                            type="text"
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
