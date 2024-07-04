import React from 'react'
import './LoadingPopup.scss'
import { FaArrowLeftLong } from "react-icons/fa6";
import {LoadingOutlined } from "@ant-design/icons";


const LoadingPopup = () => {
    return (
        <div className='popup auth-popup-form'>
            <div className="backdrop"></div>
            <div className="popup-body popup-lg">
                <div className="popup-wrapper">
                    <div className='loading-page'>
                        <div className="container-admin">
                            <div className="container-admin__inner">
                                <div className="loading-icon">
                                    <LoadingOutlined />
                                </div>
                                <h3>
                                    Loading ...
                                </h3>
                                <a href="/">
                                    <FaArrowLeftLong />
                                    Quay lại trang chủ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )
}

export default LoadingPopup