import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EyeButton } from '../';
import styles from './RegisterModal.module.scss';
import { api } from "../../libs/api/axiosInstance.ts";
import { REGISTER } from "../../libs/constants/api";
import { registerSchema } from '../../libs/schemas/registerSchema';
import storage from '../../libs/storage';

interface RegisterFormValues {
    email: string;
    password: string;
    repeatPassword: string;
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
            console.log(res);
            storage.setTokens(res.data)
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
        }
    };

    return (
        <div className={styles.modalBackground}>
            <form className={styles.modalWindow} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.modalTitle}>Регистрация по почте</h2>
                <div className={styles.modalGroupInput}>
                    <div className={styles.modalInput}>
                        <input
                            {...register("email")}
                            className={styles.modalInputPole}
                            type="email"
                            placeholder="E-mail"
                        />
                        {errors.email && <p className={styles.modalInputError}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.modalInput}>
                        <input
                            {...register("password")}
                            className={styles.modalInputPole}
                            type={showPass ? "text" : "password"}
                            placeholder="Пароль"
                        />
                        <div className={styles.modalInputEye}>
                            <EyeButton show={showPass} setShow={setShowPass} />
                        </div>
                        {errors.password && <p className={styles.modalInputError}>{errors.password.message}</p>}
                    </div>
                    <div className={styles.modalInput}>
                        <input
                            {...register("repeatPassword")}
                            className={styles.modalInputPole}
                            type={showRepeatPass ? "text" : "password"}
                            placeholder="Повторите пароль"
                        />
                        <div className={styles.modalInputEye}>
                            <EyeButton show={showRepeatPass} setShow={setShowRepeatPass} />
                        </div>
                        {errors.repeatPassword && <p className={styles.modalInputError}>{errors.repeatPassword.message}</p>}
                    </div>
                </div>
                <div>
                    <button className={styles.modalMainButton} type="submit">
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </div>
    );
}