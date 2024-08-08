import React from "react";
import "./Footer.scss";
import { FaLocationArrow, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import Payment from "../../Assets/payments.png";
const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="col">
                    <div className="title">Về chúng tôi</div>
                    <div className="text">
                    SStyle là một nền tảng thương mại điện tử thời trang năng động, cung cấp một loạt các sản phẩm quần áo và phụ kiện theo xu hướng dành cho mọi lứa tuổi. Kết hợp các xu hướng thời trang mới nhất với giao diện dễ sử dụng. Hội viên của SStyle được hưởng các quyền lợi đặc biệt. Tham gia SStyle để nâng tầm phong cách của bạn và tận hưởng những lợi ích vô song khi trở thành một phần của cộng đồng sôi động của chúng tôi.
                    </div>
                </div>
                <div className="col">
                    <div className="title">Địa chỉ liên lạc</div>
                    <div className="c-item">
                        <FaLocationArrow />
                        <div className="text">
                            Mipec, Kiến Hưng, Hà Đông, Hà Nội, Việt Nam
                        </div>
                    </div>
                    <div className="c-item">
                        <FaMobileAlt />
                        <div className="text">Phone: 0471 272 0261</div>
                    </div>
                    <div className="c-item">
                        <FaEnvelope />
                        <div className="text">Email: SStyle@gmail.com</div>
                    </div>
                </div>
                <div className="col">
                    <div className="title">Danh mục sản phẩm</div>
                    <span className="text">Áo thể thao nam</span>
                    <span className="text">Áo công sở</span>
                    <span className="text">Thời trang cho trẻ</span>
                    <span className="text">Áo polo nam</span>
                </div>
                <div className="col">
                    <div className="title">Trang</div>
                    <span className="text">Home</span>
                    <span className="text">About</span>
                    <span className="text">Privacy Policy</span>
                    <span className="text">Returns</span>
                    <span className="text">Terms & Conditions</span>
                    <span className="text">Contact Us</span>
                </div>
            </div>
            <div className="bottom-bar">
                <div className="bottom-bar-content">
                    <span className="text">
                        HUNGND1701 
                    </span>
                    <img src={Payment} />
                </div>
            </div>
        </div>
    );
};

export default Footer;