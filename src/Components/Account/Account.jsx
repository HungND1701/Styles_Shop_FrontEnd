import './Account.scss'
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import { Menu } from 'antd';
import {
  UserOutlined,
  StarOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Context } from '../../utils/context';

const items = [
  {
    key: '1',
    label: 'Thông tin tài khoản',
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: 'Lịch sử đơn hàng',
    icon: <ShoppingOutlined />,
  },
  {
    key: '3',
    label: 'Đánh giá và phản hồi',
    icon: <StarOutlined />,
  },
  {
    key: '4',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
const Account = ({children}) => {
  const navigate = useNavigate(); 
  const {currentMenuAccount, setCurrentMenuAccount} = useContext(Context);
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Điều hướng người dùng về trang đăng nhập hoặc trang chủ
      navigate('/');
      window.location.reload(); // Reset lại trang
    } else {
      alert(result.message);
    }
  };

  const handleSelectMenu = (e) =>{
    setCurrentMenuAccount(e.key);
    switch(e.key) {
      case '1':
        setCurrentMenuAccount('1');
        navigate('/account/info');
        break;
      case '2':
        setCurrentMenuAccount('2');
        navigate('/account/order');
        break;
      case '3':
        setCurrentMenuAccount('3');
        navigate('/account/reviews');
      // code block
      break;
      case '4':
        setCurrentMenuAccount('4');
        handleLogout();
        break;
      default:
        // code block
    }
  }

  return (
    <div className="account">
      <div className="account-page">
        <div className="site-content">
          <div className="container">
            <div id="account-page">
              <div className="account-page__inner">
                <div className="account-page__sidebar">
                  <Menu
                    selectedKeys={[currentMenuAccount]}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={false}
                    items={items}
                    onClick = {handleSelectMenu}
                  />
                </div>
                <div className="account-page__content">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account