import './Header.scss'
import '../../css-config/media.scss'
import React, { useEffect, useState, useContext, useRef } from 'react';
import {Form, Button} from 'antd';
import { useNavigate } from 'react-router-dom';
import { TbSearch } from 'react-icons/tb';
import { FaCartShopping } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { AiFillHeart } from 'react-icons/ai';
import { Context } from "../../utils/context";
import logo from "../../Assets/logo_word.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { searchProduct } from '../../services/product';
import SearchItem from './SearchItem/SearchItem';

const settings = {    
  dots: false,
  infinite: false,
  speed: 500,
  centerPadding: "60px",
  slidesToShow: 4,
  slidesToScroll: 4,
  autoplay: false,
  cssEase: "linear",
};

const Header = ({ onOpenLoginPopup }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState('sale');
  const {user, getTotalCartItems}= useContext(Context);
  const [isScrollUp, setIsScrollUp] = useState(true);
  const lastScrollPosition = useRef(0);
  const [isSearch, setIsSearch] = useState(false);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [searchProducts, setSearchProduct] = useState([]);

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
  const handleSearch = () => {
    form.submit();
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.trim() !== '') {
      handleSearch();
    }
  };
  const handleSubmitSearch = async ()=>{
    try {
        const $productsResponse = await searchProduct(searchValue);
        console.log($productsResponse);
        setSearchProduct($productsResponse);
      } catch (error) {
          setSearchProduct([])
      }
  }

  return (
    <header className={`main-header ${!isSearch ? isScrollUp ? '' : 'is-scroll-top' : ''}` }>
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
              <li className='nav__sub-item' onClick={()=>{setMenu("sale")}} style={{ backgroundColor: menu === 'sale' ? "#aa836e" : "" }}>
                <a href="/"> SALE </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("product")}} style={{ backgroundColor: menu === 'product' ? "#aa836e" : "" }}>
                <a href="/product"> SẢN PHẨM </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("men")}} style={{ backgroundColor: menu === 'men' ? "#aa836e" : "" }}>
                <a href="/"> NAM </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("women")}} style={{ backgroundColor: menu === 'women' ? "#aa836e" : "" }}>
                <a href="/"> NỮ </a> 
              </li>
              <li className='nav__sub-item' onClick={()=>{setMenu("kid")}} style={{ backgroundColor: menu === 'kid' ? "#aa836e" : "" }}>
                <a href="/"> TRẺ EM </a> 
              </li>
            </ul>
          </div>
        </div>
        <div className="header__actions">
          <div className="header-actions-search__box mobile--hidden tablet--hidden">
            <label htmlFor="" className='header-actions-search__field' >
              <input id="search-input" type="text" name="search" onClick={()=>setIsSearch(true)} placeholder="Tìm kiếm sản phẩm..." className='header-actions-search__control one-whole'/>
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
          </div>
        </div>
        <div className={`header-search ${isSearch ? 'is-active': ''}`} >
          <Form
            name="search-form"
            form={form}
            onFinish={handleSubmitSearch}
          >
              <Form.Item name='searchValue' className='form-item'>
                <input type="text" name="search" placeholder="Tìm kiếm sản phẩm..." autocomplete="off" className="header-search__control one-whole"
                value={searchValue}
                onChange={handleChange}
                />
                <button onClick={()=>setIsSearch(false)} className="homepage-search__submit" style={{top: '13px', right: '30px', width: 'unset', height: 'unset', zIndex: '10'}}>
                  <TbSearch />
                </button>
                <button onClick={()=>setIsSearch(false)} className="homepage-search__submit" style={{top: '13px', right: '-100px', width: 'unset', height: 'unset', zIndex: '10'}}>
                  <IoMdClose />
                </button>
              </Form.Item>
          </Form>
          <div className="search-result-container">
            <div className="search-content">
              <div className="search-content__wrapper">
                  <div className="search-content__inner">
                    {
                      searchProducts.length!==0 && (
                        <>
                          <p className="search__title" style={{fontWeight: 'bold', fontSize: '14px', marginTop: '0px', padding: '0px 80px'}}>Sản phẩm</p>
                          <div className="product-search_container">
                            <Slider {...settings} className='homepage-products__slides grid'>
                              {searchProducts.map((product, index)=>(
                                <div key={index} className="grid__column">
                                  <SearchItem product_data={product}/>
                                </div>
                              ))}
                            </Slider>
                          </div>
                          <div className={`grid`} style={{justifyContent: 'center'}}>
                            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                              <Button type='primary' style={{backgroundColor: '#CFB5A7', color: '#fff', textAlign: 'center'}}>
                                  Xem thêm   
                              </Button>
                            </div>
                          </div>
                        </>

                      )
                    }
                    {
                      searchProducts.length===0 && (
                        <div className={`grid grid--four-columns large-grid--four-columns tablet-grid--three-columns mobile-grid--two-columns`} style={{justifyContent: 'center'}}>
                          <div style={{textAlign: 'center'}}><i>Không tìm thấy kết quả phù hợp!</i></div>
                        </div>
                      )
                    }
                  </div>
              </div>
            </div>
            <div className="backgroud"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header;