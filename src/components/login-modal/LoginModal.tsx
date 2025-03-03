import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EyeButton } from '../';
import styles from './LoginModal.module.scss';
import { api } from "../../libs/api/axiosInstance.ts";
import { LOGIN } from "../../libs/constants/api";
import { loginSchema } from '../../libs/schemas/loginSchema';
import { storage, STORAGE_KEYS } from '../../libs/storage';

export function LoginModal() {
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
            const res = await api.post(LOGIN, {
                username: data.email,
                password: data.password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, refresh_token } = res.data;
            console.log(res);
            storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className={styles["modal-background"]}>
            <form className={styles["modal-window"]} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles["modal-title"]}>Вход по почте</h2>
                <div className={styles["modal-group-input"]}>
                    <div className={styles["modal-input"]}>
                        <input
                            {...register("email")}
                            className={styles["modal-input-pole"]}
                            type="text"
                            placeholder="E-mail"
                        />
                        {errors.email && (
                            <p className={styles["modal-input-error"]}>
                                {errors.email.message}
                            </p>
                        )}
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
                        {errors.password && (
                            <p className={styles["modal-input-error"]}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className={styles["modal-group-main-button"]}>
                    <button className={styles["modal-main-button"]} type="submit">
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}