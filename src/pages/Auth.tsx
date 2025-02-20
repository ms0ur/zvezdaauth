import './Auth.css'
import RegisterModalComponent from "../components/RegisterModalComponent.tsx";
import {useState} from "react";
import LoginModalComponent from "../components/LoginModalComponent.tsx";

export default function Auth() {
    const [activeModal, setActiveModal] = useState('none')
    return (
        <>
            <div className="modal-switcher">
                <button onClick={() => setActiveModal('login')}>Войти</button>
                <button onClick={() => setActiveModal('register')}>Регистрация</button>

            </div>
            <div id="bg">

                {activeModal == 'register' ? (
                    <RegisterModalComponent />
                ) : activeModal == 'login' ? (
                    <h1><LoginModalComponent /></h1>
                ): (<h1>soon</h1>)}
            </div>
        </>
    )
}