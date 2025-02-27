import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EyeButton } from '../';
import styles from './RegisterModal.module.scss';
import { api } from "../../libs/api/AxiosInstance";
import { REGISTER } from "../../libs/constants/api";
import { registerSchema } from '../../libs/schemas/registerSchema';
import { storage, STORAGE_KEYS } from '../../libs/storage';

interface RegisterFormValues {
    email: string;
    password: string;
    repeatPassword: string;
}

interface RegisterSuccessfulResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
}

export default function RegisterModal() {
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
            const res = await api.post(REGISTER, preparedData);
            const { access_token, refresh_token } = res.data as RegisterSuccessfulResponse;
            storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
        }
    };

    return (
        <div className={styles["modal-background"]}>
            <form className={styles["modal-window"]} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles["modal-title"]}>Регистрация по почте</h2>
                <div className={styles["modal-group-input"]}>
                    <div className={styles["modal-input"]}>
                        <input
                            {...register("email")}
                            className={styles["modal-input-pole"]}
                            type="email"
                            placeholder="E-mail"
                        />
                        {errors.email && <p className={styles["modal-input-error"]}>{errors.email.message}</p>}
                    </div>
                    <div className={styles["modal-input"]}>
                        <input
                            {...register("password")}
                            className={styles["modal-input-pole"]}
                            type={showPass ? "text" : "password"}
                            placeholder="Пароль"
                        />
                        <div className={styles["modal-input-eye"]}>
                            <EyeButton show={showPass} setShow={setShowPass} />
                        </div>
                        {errors.password && <p className={styles["modal-input-error"]}>{errors.password.message}</p>}
                    </div>
                    <div className={styles["modal-input"]}>
                        <input
                            {...register("repeatPassword")}
                            className={styles["modal-input-pole"]}
                            type={showRepeatPass ? "text" : "password"}
                            placeholder="Повторите пароль"
                        />
                        <div className={styles["modal-input-eye"]}>
                            <EyeButton show={showRepeatPass} setShow={setShowRepeatPass} />
                        </div>
                        {errors.repeatPassword && <p className={styles["modal-input-error"]}>{errors.repeatPassword.message}</p>}
                    </div>
                </div>
                <div className={styles["modal-group-main-button"]}>
                    <button className={styles["modal-main-button"]} type="submit">
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </div>
    );
}