import './Auth.scss'
import RegisterModal from "../components/register-modal/RegisterModal.tsx";
import {useState} from "react";
import {LoginModal} from "../components/";
import {AccountInfoModal} from "../components/";
import { api } from "../libs/api/AxiosInstance.ts";
import { LOGOUT, GET_PROFILE, DELETE_USER } from "../libs/constants/api";
import { storage, STORAGE_KEYS } from '../libs/storage';

export default function Auth() {
    const logout = async () => {
        const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) return;

        try {
            const res = await api.post(
                LOGOUT,
                {},
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );

            storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
            storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        } catch (error: any) {
            console.error('Error during logout:', error);
        }
    };

    const remove = async () => {
        const accessToken = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) return;

        try {
            const { data: { email } } = await api.get(GET_PROFILE);

            await api.delete(DELETE_USER, {
                data: { email },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
            storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
            window.location.reload();
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const [activeModal, setActiveModal] = useState('none')
    return (
        <>
            <div className="modal-switcher">
                <button onClick={() => setActiveModal('login')}>Войти</button>
                <button onClick={() => setActiveModal('register')}>Регистрация</button>
                <button onClick={() => setActiveModal('profile')}>Информация о профиле</button>
                <button onClick={() => logout()}>Выйти</button>
                <button onClick={() => remove()}>Удалить Аккаунт</button>
            </div>
            <div id="bg">

                {activeModal == 'register' ? (
                    <RegisterModal />
                ) : activeModal == 'login' ? (
                    <h1><LoginModal /></h1>
                ): activeModal == 'profile' ? (
                    <AccountInfoModal />
                ): (<h1>soon</h1>)}
            </div>
        </>
    )
}