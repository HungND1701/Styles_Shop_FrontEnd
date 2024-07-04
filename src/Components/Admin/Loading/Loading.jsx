import React from 'react'
import './Loading.scss'
import { FaArrowLeftLong } from "react-icons/fa6";
import {LoadingOutlined } from "@ant-design/icons"

const Loading = () => {
  return (
    <main className='loading-page'>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="loading-icon">
                    <LoadingOutlined />
                </div>
                <h3>
                    Loading ...
                </h3>
                <a href="/admin">
                    <FaArrowLeftLong />
                    Quay lại trang chủ
                </a>
            </div>
        </div>
    </main>
  )
}

export default Loading