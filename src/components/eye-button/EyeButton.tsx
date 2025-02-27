import styles from './EyeButton.module.scss'

import eyeButton from '../../assets/eye.svg'
import eyeSlashButton from '../../assets/eye-slash.svg'

interface EyeButtonComponentProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

export function EyeButton({
    show,
    setShow
}: EyeButtonComponentProps) {
    return (
        <div onClick={() => setShow(!show)}>
            <button type='button' className={styles.eyeButton}>
                <img src={show ? eyeButton : eyeSlashButton} alt="" />
            </button>
        </div>
    )
}