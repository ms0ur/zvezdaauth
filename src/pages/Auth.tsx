import './Auth.scss'
import RegisterModal from "../components/register-modal/RegisterModal.tsx";
import {useState} from "react";
import {LoginModal} from "../components/";
import {AccountInfoModal} from "../components/";
import { api } from "../libs/api/axiosInstance.ts";
import { LOGOUT, GET_PROFILE, DELETE_USER } from "../libs/constants/api";
import storage from '../libs/storage';
import {Login2FAModal} from "../components/";

export default function Auth() {
    const logout = async () => {
        const accessToken = storage.getTokens().access_token;
        if (!accessToken) return;

        try {
            const res = await api.post(
                LOGOUT,
                {},
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );

            console.log(res);

            storage.removeTokens();
        } catch (error: any) {
            console.error('Error during logout:', error);
        }
    };

    const remove = async () => {
        const accessToken = storage.getTokens().access_token;
        if (!accessToken) return;

        try {
            const { data: { email } } = await api.get(GET_PROFILE);

            const res = await api.delete(DELETE_USER, {
                data: { email },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            console.log(res);

            storage.removeTokens();
            window.location.reload();
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const [activeModal, setActiveModal] = useState('none')
    return (
        <>
            <div className="modal-switcher">
                <button className="modal-button" onClick={() => setActiveModal('login')}>Войти</button>
                <button className="modal-button" onClick={() => setActiveModal('2fa')}>2FA Вход</button>
                <button className="modal-button" onClick={() => setActiveModal('register')}>Регистрация</button>
                <button className="modal-button" onClick={() => setActiveModal('profile')}>Информация о профиле</button>
                <button className="modal-button" onClick={() => logout()}>Выйти</button>
                <button className="modal-button" onClick={() => remove()}>Удалить Аккаунт</button>
            </div>
            <div id="bg">

                {activeModal == 'register' ? (
                    <RegisterModal />
                ) : activeModal == 'login' ? (
                    <LoginModal />
                ): activeModal == 'profile' ? (
                    <AccountInfoModal />
                ): activeModal == '2fa' ? (
                    <Login2FAModal />
                ): (<h1>e</h1>)}
            </div>
        </>
    )
}