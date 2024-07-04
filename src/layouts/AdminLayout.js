// src/layouts/AdminLayout.js
import React from 'react';
import Sidebar from '../Components/Admin/Sidebar/Sidebar';
import "./css/AdminLayout.scss"
import Header from '../Components/Admin/Header/Header';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-wrapper">
            <Sidebar/>
            <div className='content-page'>
                <Header/>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;