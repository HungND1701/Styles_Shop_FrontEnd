import React, {useState} from 'react'
import './Header.scss'
import avatar_img from '../../../Assets/avatar.png'
import { Button} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { IoNotificationsOutline } from "react-icons/io5";


const Header = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
  return (
    <header className='main-header-admin'>
        <div className="header-inner">
            <div>
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{
                    }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div> 
            <div className="header-actions">
                <div className="header-actions__button">
                    <a href="">
                        <IoNotificationsOutline/>
                    </a>
                </div>
                <div className="avatar">
                    <img src={avatar_img} alt="" />
                </div>    
            </div>
        </div>
    </header>
  )
}

export default Header