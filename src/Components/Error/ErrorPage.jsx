import React from 'react'
import './ErrorPage.scss'
import error_img from '../../../Assets/error-404.png'
import { FaArrowLeftLong } from "react-icons/fa6";


const ErrorPage = () => {
  return (
    <main className='error_page'>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="img-error">
                    <img src={error_img} alt="" />
                </div>
                <h3 className='h3-404'>404: Trang bạn đang tìm kiếm không có ở đây</h3>
                <p>Hãy thử lại đường dẫn hoặc quay trở lại trang chủ. Rất xin lỗi vì sự bất tiện này.</p>
                <a href="/admin">
                    <FaArrowLeftLong />
                    Quay lại trang chủ
                </a>
            </div>
        </div>
    </main>
  )
}

export default ErrorPage