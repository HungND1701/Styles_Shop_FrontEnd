import './Popup.scss'
import React, {useState} from 'react'

const Popup = ({ children ,  onClosePopup }) => {

  return (
    <div className='popup auth-popup-form'>
        <div className="backdrop"></div>
        <div className="popup-body popup-lg">
            <span onClick={onClosePopup} className='close-popup'>✕</span>
            <div className="popup-wrapper">
              { children }
            </div>
        </div>
    </div>
  )
}
export default Popup;