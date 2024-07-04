import './Header.scss'
import '../../css-config/media.scss'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbSearch } from 'react-icons/tb';
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { AiFillHeart } from 'react-icons/ai';
import Search from './Search/Search';
import Cart from '../Cart/Cart';
import { Context } from "../../utils/context";
import logo from "../../Assets/logo_word.svg";

const Header = ({ onOpenLoginPopup }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState('sale');
  const {user, getTotalCartItems}= useContext(Context);
  const [isScrollUp, setIsScrollUp] = useState(true);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      if(scrollPosition < 30) setIsScrollUp(true);
      else{
        setIsScrollUp(scrollPosition < lastScrollPosition.current);
        lastScrollPosition.current = scrollPosition;
      }
    }

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const onOpenUserInfo = () => {
    navigate('/account/info'); // Điều hướng đến trang /user
  };

  return (
    <header className={`main-header ${isScrollUp ? '' : 'is-scroll-top'}` }>
      <div className="header__inner">
        <div className="header__toggle">
          <div>
            <a href="#" className="menu-toggle">
              <span></span> 
              <span></span> 
              <span></span>
            </a>
          </div> 
          <div className="mobile--visible tablet--visible">
            <a href="#" rel-script="search-toggle" ga-tracking-value="mbmenu-search-header" ga-tracking-label="Tìm kiếm header - mobile" className="menu-toggle is-active">
              <div className="menu-toggle__search">
                <TbSearch/>
              </div>
            </a>
          </div>
        </div>
        <div className="header-logo">
          <a href="/">
            <img src={logo} alt="header-logo" />
          </a>
        </div>
        <div className="tablet--hidden mobile--hidden">
          <div className="header-content">
            <ul className='nav__sub nav__sub-active'>
              <li className='nav__sub-item' onClick={()=>{setMenu("sale")}} style={{ backgroundColor: menu === 'sale' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/"> SALE </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("product")}} style={{ backgroundColor: menu === 'product' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/product"> SẢN PHẨM </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("men")}} style={{ backgroundColor: menu === 'men' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/"> NAM </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("women")}} style={{ backgroundColor: menu === 'women' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/"> NỮ </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("kid")}} style={{ backgroundColor: menu === 'kid' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/"> TRẺ EM </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("san xuat rieng")}} style={{ backgroundColor: menu === 'san xuat rieng' ? "rgb(255, 86, 5)" : "" }}>
                <a href="/"> SẢN XUẤT RIÊNG </a> 
              </li>
            </ul>
          </div>
        </div>
        <div className="header__actions">
          <div className="header-actions-search__box mobile--hidden tablet--hidden">
            <label htmlFor="" className='header-actions-search__field'>
              <input id="search-input" type="text" name="search" rel-script="search-input" placeholder="Tìm kiếm sản phẩm..." className='header-actions-search__control one-whole'/>
              <a href="#" className='header-actions-search__button'>
                <TbSearch />
              </a>
              
            </label>
          </div>
          <div className="header-actions__buttons">
            <a href="/favorist">
              <AiFillHeart/>
            </a>
          </div>
          <div className="header-actions__buttons">
            <a onClick={user ? onOpenUserInfo : onOpenLoginPopup } className='login'>
              <FaUser color={user ? "#73BCF6": ""}/>
            </a>
          </div>
          <div className="header-actions__buttons">
            <a href="/cart">
              <FaCartShopping />
            </a>
            <span className='counts site-header__cartcount'>{getTotalCartItems()}</span>
            {/* <div className="header-actions-cart__menu">
              <div className="header-actions-cart__inner">
                <div className="mini-cart">
                  <div className="mini-cart__wrapper">
                    <div className="mini-cart__header">
                        <span>0 sản phẩm</span>
                        <a href="/cart">Xem tất cả</a>
                    </div>
                    <div className="mini-cart__item">
                      <div className="mini-cart__item-thumbnail">
                        <img src="" alt="" />
                      </div>
                      <div className="mini-cart_item-content">
                        <span className="mini-cart__remove">✕</span>
                        <div className="mini-cart__item-title">
                          <a href="/product/1" target='_blank'>Áo thể thao mấu 1</a>
                        </div>
                        <div className="mini-cart__item-variant-info"> Cam Paprika / S</div>
                        <div>
                          <span className='mini-cart__item-price'>239.000đ</span>
                        </div>
                        <div>
                          <span className='mini-cart__item-quantity'>x1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header;