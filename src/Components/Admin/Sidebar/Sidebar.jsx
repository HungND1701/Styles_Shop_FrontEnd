import React, {useState} from 'react'
import './Sidebar.scss'
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { logout } from '../../../services/auth';
import logo from '../../../Assets/logo2.svg'
import { FaChartPie , FaUsers} from "react-icons/fa";
import { FaShirt } from "react-icons/fa6";
import {
  ProductOutlined,
  StarOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ExportOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const items = [
  {
    key: '1',
    label: 'Thống kê tổng quan',
    icon: <FaChartPie />,
  },
  {
    key: '2',
    label: 'Đơn hàng',
    icon: <ShoppingOutlined />,
  },
  {
    key: '3',
    label: 'Danh mục sản phẩm',
    icon: <ProductOutlined />,
  },
  {
    key: '5',
    label: 'Sản phẩm',
    icon: <FaShirt/>,
  },
  {
    key: '7',
    label: 'Đánh giá',
    icon: <StarOutlined/>,
  },
  {
    key: '8',
    label: 'Homepage',
    icon: <HomeOutlined />,
  },
  {
    key: '6',
    label: 'Users',
    icon: <FaUsers />,
  },
  {
    key: '4',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
const Sidebar = () => {
  const navigate = useNavigate(); 
  const [currentMenu, setCurrentMenu] = useState('1');

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload(); // Reset lại trang
    console.log('Logged out');
  };

  const handleSelectMenu = (e) =>{
    setCurrentMenu(e.key);
    switch(e.key) {
      case '1':
        // code block
        break;
      case '2':
        // code block
        break;
      case '3':
        navigate('/admin/category');
        break;
      case '4':
        handleLogout();
        break;
      case '5':
        navigate('/admin/product');
        break;
      case '6':
        
        break;
      case '7':
        
        break;
      case '8':
        navigate('/admin/homepage');
        break;
      default:
        // code block
    }
  }
  return (
    <div className="sidebar">
        <div className='logo'>  
          <a href="/admin">
            <img src={logo} alt="" />
          </a>
          <h4>Tối giản - Phong cách</h4>
        </div>
        <div className="menu">
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            inlineCollapsed={false}
            items={items}
            onClick = {handleSelectMenu}
          />
        </div>
        <div className="gotoWeb">
          <a href="/">
            Đi tới website
            <ExportOutlined />
          </a>
        </div>
    </div>
  )
}

export default Sidebar