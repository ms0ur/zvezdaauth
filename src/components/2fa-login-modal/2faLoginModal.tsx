import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './2faLoginModal.module.scss';
import { api } from '../../libs/api/axiosInstance';
import { AUTH, LOGIN2FA } from '../../libs/constants/api';
import { storage, STORAGE_KEYS } from '../../libs/storage';
import { authCodeSchema } from '../../libs/schemas/authCodeSchema';
import { loginSchema } from '../../libs/schemas/loginSchema';
import { EyeButton } from '../eye-button/EyeButton';

export function Login2FAModal() {
    const [secondWindow2fa, setSecondWindow2fa] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [authKey, setAuthKey] = useState('');

    // useForm для логина (email, password)
    const {
        register: loginRegister,
        handleSubmit: loginHandleSubmit,
        formState: { errors: loginErrors }
    } = useForm({
        resolver: yupResolver(loginSchema)
    });

    // useForm для кода подтверждения
    const {
        register: codeRegister,
        handleSubmit: codeHandleSubmit,
        formState: { errors: codeErrors }
    } = useForm({
        resolver: yupResolver(authCodeSchema)
    });

    const onLoginSubmit = async (data: any) => {
        try {
            const res = await api.post(
                LOGIN2FA,
                {
                    username: data.email,
                    password: data.password
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            const { authKey } = res.data;
            console.log(res);
            setAuthKey(authKey);
            setSecondWindow2fa(true);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const onCodeSubmit = async (data: any) => {
        try {
            const res = await api.post(AUTH, {
                authKey: authKey,
                authCode: data.code
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
        <>
            {secondWindow2fa ? (
                <div className={styles['modal-background']}>
                    <form className={styles['modal-window']} onSubmit={codeHandleSubmit(onCodeSubmit)}>
                        <h2 className={styles['modal-title']}>Введите код из E-Mail письма</h2>
                        <div className={styles['modal-group-input']}>
                            <div className={styles['modal-input']}>
                                <p className={styles['modal-desc']}>На ваш email было отправлено письмо с кодом подтверждения. Введите его в поле ниже.</p>
                                <input
                                    {...codeRegister('code')}
                                    className={styles['modal-input-pole']}
                                    type="text"
                                    placeholder="Код подтверждения"
                                />
                                {codeErrors.code && (
                                    <p className={styles['modal-input-error']}>{codeErrors.code.message}</p>
                                )}
                            </div>
                        </div>
                        <div className={styles['modal-group-main-button']}>
                            <button className={styles['modal-main-button']} type="submit">
                                Подтвердить
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles['modal-background']}>
                    <form className={styles['modal-window']} onSubmit={loginHandleSubmit(onLoginSubmit)}>
                        <h2 className={styles['modal-title']}>Вход по почте</h2>
                        <div className={styles['modal-group-input']}>
                            <div className={styles['modal-input']}>
                                <input
                                    {...loginRegister('email')}
                                    className={styles['modal-input-pole']}
                                    type="text"
                                    placeholder="E-mail"
                                />
                                {loginErrors.email && (
                                    <p className={styles['modal-input-error']}>{loginErrors.email.message}</p>
                                )}
                            </div>
                            <div className={styles['modal-input']}>
                                <input
                                    {...loginRegister('password')}
                                    className={styles['modal-input-pole']}
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Пароль"
                                />
                                <div className={styles['modal-input-eye']}>
                                    <EyeButton show={showPass} setShow={setShowPass} />
                                </div>
                                {loginErrors.password && (
                                    <p className={styles['modal-input-error']}>{loginErrors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <div className={styles['modal-group-main-button']}>
                            <button className={styles['modal-main-button']} type="submit">
                                Войти
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
