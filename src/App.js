import './App.css';
import React, {useState } from 'react';
import { BrowserRouter, Routes, Route,  Navigate  } from 'react-router-dom';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Category from './pages/customer/Category/Category';
import SingleProduct from "./Components/SingleProduct/SingleProduct";
import Newsletter from "./Components/Footer/Newsletter/Newsletter";
import AppContext from './utils/context';
import Popup from './Components/Popup/Popup';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import Cart from './Components/Cart/Cart';
import Notify from './Components/Notify/Notify';
import Account from './Components/Account/Account';
import PrivateRoute from './Components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import CategoryAdmin from './pages/admin/CategoryAdmin/CategoryAdmin';
import CategoryDetail from './pages/admin/CategoryAdmin/CategoryDetail/CategoryDetail';
import ProductCreate from './pages/admin/Product/ProductCreate/ProductCreate';
import Error from './Components/Admin/Error/Error';
import Product from './pages/admin/Product/Product';
import Homepage from './pages/admin/HomepageAdmin/Homepage';
import User from './Components/Account/User/User';
import OrderHistory from './Components/Order/OrderHistory/OrderHistory';
import OrderDetail from './Components/Order/OrderDetail/OrderDetail';
import Review from './Components/Review/Review';
import ProductDetail from './pages/admin/Product/ProductDetail/ProductDetail';
import ProductEdit from './pages/admin/Product/ProductEdit/ProductEdit';
import ReviewAdmin from './pages/admin/ReviewAdmin/ReviewAdmin';
import UserAdmin from './pages/admin/UserAdmin/UserAdmin';
import Overview from './pages/admin/Overview/Overview';
import OrderAdmin from './pages/admin/OrderAdmin/OrderAdmin';
import OrderAdminDetail from './pages/admin/OrderAdmin/OrderAdminDetail/OrderAdminDetail';


function App() {
  const [isPopupLoginOpen, setIsPopupLoginOpen] = useState(false);
  const [isPopupRegisterOpen, setIsPopupRegisterOpen] = useState(false);
  const [isPopupForgotOpen, setIsPopupForgotOpen] = useState(false);

  const handleOpenLoginPopup = () => {
    setIsPopupRegisterOpen(false);
    setIsPopupForgotOpen(false);
    setIsPopupLoginOpen(true);
  };
  const handleOpenRegisterPopup = () => {
    setIsPopupLoginOpen(false);
    setIsPopupForgotOpen(false)
    setIsPopupRegisterOpen(true);
  };
  const handleOpenForgotPopup = () => {
    setIsPopupLoginOpen(false);
    setIsPopupRegisterOpen(false);
    setIsPopupForgotOpen(true)
  };

  const handleClosePopup = () => {
    setIsPopupLoginOpen(false);
    setIsPopupRegisterOpen(false);
    setIsPopupForgotOpen(false)
  };

  return (
    <BrowserRouter>
      <AppContext>
        <div id='app'>
          <ScrollToTop />
          {(isPopupLoginOpen || isPopupRegisterOpen || isPopupForgotOpen)  && (
            <Popup onClosePopup={handleClosePopup}>
              {isPopupLoginOpen && (<Login onOpenRegisterPopup={handleOpenRegisterPopup} onOpenForgotPopup={handleOpenForgotPopup}/>)}
              {isPopupRegisterOpen && (<Register onOpenLoginPopup={handleOpenLoginPopup}/>)}
              {isPopupForgotOpen && (<ForgotPassword onOpenLoginPopup={handleOpenLoginPopup}/>)}
            </Popup>
          )}
          <Routes>
            <Route path="/admin" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <Overview/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/review" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <ReviewAdmin/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/user" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <UserAdmin/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/order" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <OrderAdmin/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/order/:id" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <OrderAdminDetail/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/category" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <CategoryAdmin/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/category/:id" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <CategoryDetail />
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/product" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <Product/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/product/create" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <ProductCreate />
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/product/edit/:id" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <ProductEdit />
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/product/:id" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <ProductDetail />
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/admin/homepage" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <Homepage/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            
            <Route path="admin/error/not-found" element={
                <PrivateRoute role={1}>
                    <AdminLayout>
                        <Error/>
                    </AdminLayout>
                </PrivateRoute>
            }/>
            <Route path="/" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Home />
                </UserLayout>
            }/>
            <Route path="/category/:id" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Category />
                </UserLayout>
            }/>
            <Route path="/product/:id" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <SingleProduct />
                </UserLayout>
            }/>
            <Route path="/cart" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Cart onOpenLoginPopup={handleOpenLoginPopup}/>
                </UserLayout>
            }/>
            <Route path="/account/info" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Account>
                        <User/>
                    </Account>
                </UserLayout>
            }/>
            <Route path="/account/order" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Account>
                        <OrderHistory/>
                    </Account>
                </UserLayout>
            }/>
            <Route path="/get-order/:id" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Account>
                        <OrderDetail/>
                    </Account>
                </UserLayout>
            }/>
            <Route path="/account/reviews" element={
                <UserLayout onOpenLoginPopup={handleOpenLoginPopup}>
                    <Account>
                        <Review/>
                    </Account>
                </UserLayout>
            }/>
            <Route path="/notfound" element={
                    <Error/>
            }/>
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Routes>
        </div>
        <Notify/>
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
