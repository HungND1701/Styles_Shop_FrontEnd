// src/layouts/UserLayout.js
import React from 'react';
import Header from '../Components/Header/Header';
import Newsletter from '../Components/Footer/Newsletter/Newsletter';
import Footer from '../Components/Footer/Footer';

const UserLayout = ({ children, onOpenLoginPopup }) => {
    return (
        <div className="site-wrapper">
            <Header onOpenLoginPopup={onOpenLoginPopup}/>
            {children}
            <Newsletter/>
            <Footer/>
        </div>
    );
};

export default UserLayout;