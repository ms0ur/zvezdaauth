import {FormEvent, useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './2faLoginModal.module.scss';
import { api } from '../../libs/api/axiosInstance';
import { AUTH, LOGIN2FA } from '../../libs/constants/api';
import storage from '../../libs/storage';
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

    const [codeError, setCodeError] = useState('');
    const [code, setCode] = useState('');

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

    const onCodeSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setCodeError('')
        if (code.length < 1) {
            setCodeError('Введите код из письма')
            return
        }
        try {
            const res = await api.post(AUTH, {
                authKey: authKey,
                authCode: code
            });
            console.log(res);
            storage.setTokens(res.data)
        } catch (error) {
            console.error('Error logging in:', error);
            setCodeError('Неверный код')
        }
    };

    const changeCode=(e:FormEvent<HTMLInputElement>)=> {
        try{
            setCode((e.target as HTMLInputElement).value);
            setCodeError('')
        } catch (error) {
            console.error('error updating codeset:', error);
        }

    }

    return (
        <>
            {secondWindow2fa ? (
                <div className={styles.modalBackground}>
                    <form className={styles.modalWindow} onSubmit={onCodeSubmit}>
                        <h2 className={styles.modalTitle}>Введите код из E-Mail письма</h2>
                        <div className={styles.modalGroupInput}>
                            <div className={styles.modalInput}>
                                <p className={styles.modalDesc}>На ваш email было отправлено письмо с кодом подтверждения. Введите его в поле ниже.</p>
                                <input
                                    className={styles.modalInputPole}
                                    type="text"
                                    placeholder="Код подтверждения"
                                    onChange={changeCode}
                                />
                                {codeError.length > 0 && (
                                    <p className={styles.modalInputError}>{codeError}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <button className={styles.modalMainButton} type="submit">
                                Подтвердить
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.modalBackground}>
                    <form className={styles.modalWindow} onSubmit={loginHandleSubmit(onLoginSubmit)}>
                        <h2 className={styles.modalTitle}>Вход по почте</h2>
                        <div className={styles.modalGroupInput}>
                            <div className={styles.modalInput}>
                                <input
                                    {...loginRegister('email')}
                                    className={styles.modalInputPole}
                                    type="text"
                                    placeholder="E-mail"
                                />
                                {loginErrors.email && (
                                    <p className={styles.modalInputError}>{loginErrors.email.message}</p>
                                )}
                            </div>
                            <div className={styles.modalInput}>
                                <input
                                    {...loginRegister('password')}
                                    className={styles.modalInputPole}
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Пароль"
                                />
                                <div className={styles.modalInputEye}>
                                    <EyeButton show={showPass} setShow={setShowPass} />
                                </div>
                                {loginErrors.password && (
                                    <p className={styles.modalInputError}>{loginErrors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <button className={styles.modalMainButton} type="submit">
                                Войти
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
