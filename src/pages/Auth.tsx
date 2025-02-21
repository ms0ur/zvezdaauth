import './Auth.css'
import RegisterModalComponent from "../components/RegisterModalComponent.tsx";
import {useState} from "react";
import LoginModalComponent from "../components/LoginModalComponent.tsx";
import AccountInfoModalComponent from "../components/AccounInfoModalComponent.tsx";
import AxiosInstance from "../AxiosInstance.ts";

export default function Auth() {
    const logout = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

        try {
            const res = await AxiosInstance.post(
                '/access/logout',
                {},
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );

            if (res.status === 200) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        } catch (error: any) {
            // If unauthorized, try to refresh token and retry logout.
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const resRef = await AxiosInstance.post('/access/refresh', {
                        refresh_token: refreshToken,
                    });
                    if (resRef.status === 200) {
                        localStorage.setItem('access_token', resRef.data.access_token);
                        await logout();
                    }
                }
            } else {
                console.error('Error during logout:', error);
            }
        }
    };

    const remove = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

        try {
            const { data: { email } } = await AxiosInstance.get('/access/profile', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            await AxiosInstance.delete('/access/hard-delete-user', {
                data: { email }
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
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
                    <RegisterModalComponent />
                ) : activeModal == 'login' ? (
                    <h1><LoginModalComponent /></h1>
                ): activeModal == 'profile' ? (
                    <AccountInfoModalComponent />
                ): (<h1>soon</h1>)}
            </div>
        </>
    )
}