import './EyeButtonComponent.css'

import eyeButton from '../assets/eye.svg'
import eyeSlashButton from '../assets/eye-slash.svg'

interface EyeButtonComponentProps {
    show: boolean;
    setShow: (show: boolean) => void;
}



export default function EyeButtonComponent({
                                               show,
                                               setShow
                                           }:EyeButtonComponentProps) {
    return (
        <>
          <div onClick={() => setShow(!show)}>
              {show ? (
                  <button type='button' className={"eyeButton"}>
                      <img src={eyeButton} alt=""/>
                  </button>
              ) : (
                  <button type='button' className={"eyeButton"}>
                      <img src={eyeSlashButton} alt=""/>
                  </button>
              )}
          </div>
        </>
    )
}