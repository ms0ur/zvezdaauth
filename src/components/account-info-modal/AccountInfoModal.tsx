import { useEffect, useState } from 'react';
import styles from './AccountInfoModal.module.scss';
import { api } from "../../libs/api/AxiosInstance";
import { GET_PROFILE } from "../../libs/constants/api";

interface AccountInfoSuccessfulResponse {
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateCreate: string;
    dateUpdate: string;
}

export function AccountInfoModal() {
    const [data, setData] = useState<AccountInfoSuccessfulResponse | null>(null);

    const requestProfile = async () => {
        try {
            const res = await api.get(GET_PROFILE);

            setData(res.data as AccountInfoSuccessfulResponse);
        } catch (error: any) {
            console.error('Error getting profile:', error);
        }
    };

    useEffect(() => {
        requestProfile();
    }, []);

    return (
        <div className={styles["modal-background"]}>
            <div className={styles["modal-window"]}>
                <h2 className={styles["modal-title"]}>Информация о профиле</h2>
                <div className={styles["modal-group-input"]}>
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