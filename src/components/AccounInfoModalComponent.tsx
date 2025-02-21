import { useEffect, useState } from 'react';
import './AccountInfoModalComponent.css';
import AxiosInstance from "../AxiosInstance";

interface AccountInfoSuccessfulResponse {
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateCreate: string;
    dateUpdate: string;
}

export default function AccountInfoModalComponent() {
    const [data, setData] = useState<AccountInfoSuccessfulResponse | null>(null);

    const requestProfile = async () => {
        try {
            const res = await AxiosInstance.get('/access/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (res.status === 200) {
                setData(res.data as AccountInfoSuccessfulResponse);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('access_token');
                try {
                    const refreshRes = await AxiosInstance.post('/access/refresh', {
                        refresh_token: localStorage.getItem('refresh_token')
                    });
                    if (refreshRes.status === 200) {
                        localStorage.setItem('access_token', refreshRes.data.access_token);
                        await requestProfile();
                    }
                } catch (refreshError) {
                    console.error("Ошибка обновления токена:", refreshError);
                }
            } else {
                console.error("Ошибка при получении данных профиля:", error);
            }
        }
    };

    useEffect(() => {
        requestProfile();
    }, []);

    return (
        <div className="ModalBackground">
            <div className="ModalWindow">
                <h2 className="ModalTitle rubik-700">Информация о профиле</h2>
                <div className="ModalGroupInput">
                    {data ? (
                        <>
                            <p>email: {data.email}</p>
                            <p>Имя: {data.firstName}</p>
                            <p>Фамилия: {data.lastName}</p>
                            <p>Отчество: {data.middleName}</p>
                            <p>Дата создания: {new Date(data.dateCreate).toLocaleDateString()}</p>
                            <p>Дата обновления: {new Date(data.dateUpdate).toLocaleDateString()}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
