import './SingleProduct.scss'

import React,{useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pagination, message } from 'antd';
import Slider from 'react-slick';
import { Tooltip } from 'react-tooltip';
import { AiTwotoneExclamationCircle } from "react-icons/ai";
import { MdCurrencyExchange } from "react-icons/md";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import ProductSlider from '../Products/ProductSlider/ProductSlider';
import products_data from '../../Assets/product';
import { Context } from '../../utils/context';
import {getProductById, formatNumber, getNewPrice} from '../../services/product';
import LoadingPopup from '../Loading/LoadingPopup';

const SingleProduct = (props) => {
  const { id } = useParams();
  const reviews= [
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    },
    {
      product_id : 1,
      user : {
        id: 1,
        username: "hungnd1701",
      },
      color_size: [
        {
          color_name: "nâu",
          size_name: "L",
        },
        {
          color_name: "xanh",
          size_name: "M",
        }
      ],
      star: 5,
      comment: "Hàng chất lượng, phù hợp với giá cả!",
      time: "01.05.2024",
    }
  ]
  const [product , setProduct] = useState({
    color_product:[{images: null}],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {setIsClickAdd, addItemToCart, setNotifyContent} = useContext(Context);
  const [colorIndex , setColorIndex] = useState(0);
  const [isPickedSize, setIsPickedSize] = useState(false);
  const [sizePicked, setSizePicked] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const arr = [1,2,3,4,5];
  const [quantity, setQuantity] = useState(1);
  const [isError, setIsError] = useState(false);
  const [settings, setSettings] = useState({});

  const settingSlider ={
    dots: true,
    infinite: false,
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [data1] = await Promise.all([getProductById(id)]);
            setThumbnails(data1.color_product[colorIndex].images);
            setProduct(data1);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    if (product && product.color_product[colorIndex]) {
      setThumbnails(product.color_product[colorIndex].images);
    }
  }, [colorIndex, product]);

  useEffect(() => {
    setSettings({
      customPaging: function(i) {
        return (
          <img src={thumbnails?.[i]?.url || ''} alt={`thumbnail-${i}`} />
        );
      },
      appendDots: dots => (
        <div>
          <ul className='list-dots'> {dots} </ul>
        </div>
      ),
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      fade: true,
    });
  }, [thumbnails]);

  if (loading) {
    return <LoadingPopup/>
    // return <Loading/>;
  }
  if (error) {
    return 
  }
  // Hàm xử lý khi nhấn nút giảm
  const handleReduce = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Hàm xử lý khi nhấn nút tăng
  const handleAugment = (e) => {
    e.preventDefault();
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  // Hàm xử lý khi thay đổi giá trị ô input
  const handleChangeQuantity = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handlePickColor = (index) => {
    setColorIndex(index);
  }
  const handlePickSize = (size) => {
    setSizePicked(size);
    setIsPickedSize(true);
  }

  const handleAddItems = () =>{
    if(sizePicked){
      setIsError(false);
      const item = {
        ...product,
        color_picked: product.color_product[colorIndex].color.name,
        size_picked: sizePicked.name,
        colorId_picked: product.color_product[colorIndex].color.id,
        sizeId_picked: sizePicked.id,
        img : product.color_product[colorIndex].images[0].url,
        new_price: getNewPrice(product.price, product.sale),
        old_price: formatNumber(product.price),
        quantity: quantity,
      }
      setIsClickAdd(true);
      addItemToCart(item);
    }else{
      const notify = {
        type: 'fail',
        message: "Bạn chưa chọn loại sản phẩm",
        content: null,
      }
      setNotifyContent(notify);
      setIsError(true);
      setIsClickAdd(true);
    }
  }
  return (
    <main className='product-single'>
      <section className="product-single__infomation">
        <div className="container container--medium" style={{maxWidth: "1120px"}}>
          <div className="breadcrumb">
            <ol className="page-breadcrumb breadcrumb__list">
              <li><a href="http://localhost:3000/" className="breadcrumb__item">Trang chủ</a></li> 
              <li><a href="http://localhost:3000/product/1" className="breadcrumb__item">{product.categories[0].name}</a></li>
            </ol>
          </div>
          <div className="product-single__wrapper">
            <div className="product-single__images">
              <div className="product-single__thumbnails">
                <div className="product-single__inner">
                  <Slider {...settings} className='thumbnails'>
                    {
                      thumbnails.map((thumb)=>(
                        <div className='image'>
                          <img loading='lazy' src={thumb.url}></img>
                        </div>
                      ))
                    }
                  </Slider>
                </div>
              </div>
            </div>
            <div className="product-single__summary">
              <div className="product-single__sticky">
                <h1 rel-script="product-single-title" className="product-single__title">
                  {product.name}
                  <span className="product-grid__sub-title">{"Sản phẩm độc đáo"}</span>
                </h1>
                <div className="product-single__ratings scroll-to-step">
                  <div data-review-count={102} data-review-avg={4.9} className="reviews-rating">
                    {
                      arr.map((index)=>{
                        if(index <= Math.floor(4.9)){
                          return <div className="reviews-rating__star is-active"></div>
                        }else if(index <= Math.floor(4.9 + 1)){
                          return <div className="reviews-rating__star is-half"></div>
                        }else{
                          return <div className="reviews-rating__star is-empty"></div>
                        }
                      })
                    }
                    <div className="reviews-rating__count">
                            ({102})
                    </div>
                  </div>
                </div>
                <div id="pro-price" className="product-single__price-infomation">
                  <div className="product-single__prices"></div> 
                  <div rel-script="product-single-prices" data-total-variants-price="" data-compare-price="329000" data-regular-price="329000" className="product-single__prices">
                    <ins className="product-single__regular-price">{getNewPrice(product.price, product.sale)} đ</ins> 
                    <del className="product-single__compare-price"><del>{formatNumber(product.price)} đ</del></del>
                    <span className="product-single__percent-price">{product.sale}</span>
                  </div> 
                  <div className="product-single__freeship">
                    <p className="freeship__text">Miễn phí giao hàng</p> 
                    <p className="freeship__day-delivery">
                      Giao hàng 1-2 ngày - Hà Nội &amp; TP. Hồ Chí Minh
                      <span></span>
                    </p>
                    <p className="product-single__tooltip freeship-tooltip" data-tooltip-variant="light">
                      <AiTwotoneExclamationCircle />
                      <Tooltip
                        anchorSelect=".product-single__tooltip"
                        content="Tỉnh thành khác nhận hàng từ 2-5 ngày"
                        style={{ borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, .2)"}}
                      />
                    </p> 
                    <p></p>
                  </div> 
                  <div className="product-single__pricing">
                  Mua 2 được giảm thêm 20%
                  </div>
                </div>
                <div className="product-single__addtocart">
                  <form action=""></form>
                  <div className="product-single__options">
                    <div rel-script="product-single-option-item" className="product-single__option">
                      <div className="option-heading">
                        <span className="option-heading__title">Màu sắc: <span rel="product-option-title-color" className="text--bold" style={{textTransform: "capitalize"}}>{product.color_product[colorIndex].color.name}</span></span>
                      </div> 
                      <div data-option-id="color" data-option-index="1" className="option-select option-select--color">
                        {
                          product.color_product.map((colorPrd,index)=>(
                            <label className="option-select__item option-select__item--color nau">
                              <div className="option-select__inner">
                                <input type="radio" name="color" value={colorPrd.color.name} defaultChecked={index===colorIndex} data-gallery="" data-title={colorPrd.color.name}
                                  onClick={()=>handlePickColor(index)}
                                /> 
                                <span className="checkmark checkmark--color" style={{backgroundColor: `${colorPrd.color.code}`}}></span>
                              </div>
                            </label> 
                          ))
                        }
                      </div>
                    </div> 
                    <div rel-script="product-single-option-item" className={`product-single__option ${isError ? 'is-error': ''}`}>
                      <div className="option-heading">
                        <span className="option-heading__title">Kích thước: 
                          <span rel="product-option-title-size" className="text--bold">{sizePicked ? sizePicked.name : ""}</span> 
                          <span rel="product-option-sizechart" className="product-option-size size">{sizePicked ? " ("+ sizePicked.height + " | " +  sizePicked.weight+")" : ""}</span>
                        </span> 
                        <a href="#size-guide" ga-tracking-value="huong-dan-chon-size" rel-script="toggle-size-guide" className="option-heading__sizeguide">
                          Hướng dẫn chọn size
                        </a>
                      </div> 
                      <div data-option-id="size" data-option-index="2" className="option-select option-select--size">
                        {
                          product.color_product[colorIndex].sizes.map((size, index)=>(
                            <label data-tooltip-id="size-tooltip" data-tooltip-variant="light" className="option-select__item option-size s " data-tooltip-html={`${size.size.height}<br />${size.size.weight}`}
                            onClick={()=>handlePickSize(size.size)}
                            >
                              <div className="option-select__inner">
                                <input type="radio" name="size" value={size.size.name} data-title={size.size.name}/> 
                                <span className="checkmark">{size.size.name}</span>
                              </div> 
                              <Tooltip
                                  id="size-tooltip"
                                  style={{ borderRadius: "10px", zIndex: "9999", boxShadow: "0 0 5px 0 rgba(0, 0, 0, .1)"}}
                                  place='bottom'
                              />
                            </label> 
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  <div className="product-single__actions">
                    <div className="product-single__quantity">
                      <div rel-script="quantity-change" className="quantity">
                        <a href="#" className="quantity__reduce" onClick={handleReduce}>-</a> 
                        <input
                          type="number"
                          value={quantity}
                          max="99"
                          min="1"
                          className="quantity__control"
                          onChange={handleChangeQuantity}
                        />
                        <a href="#" className="quantity__augure" onClick={handleAugment}>+</a>
                      </div>
                    </div> 
                    <div className="product-single__button">
                      <a href="#" 
                      data-product-id="66222c27276f3a6c850446ab" 
                      data-variant-id="" data-quantity="1" 
                      rel-script="product-add-to-cart" 
                      className="btn"
                      onClick={()=>handleAddItems()}
                      >{isPickedSize? "Thêm vào giỏ hàng": "Chọn kích thước"}</a>
                    </div>
                  </div>
                </div>
                <div className="product-single__policy">
                  <div className="product-policy">
                    <div className="product-policy__item">
                      <div className="product-policy__icon">
                        <MdCurrencyExchange/>
                      </div> 
                      <span className="product-policy__title">Đổi trả miễn phí 15 ngày</span>
                    </div>
                    <div className="product-policy__item">
                      <div className="product-policy__icon">
                        <AiFillSafetyCertificate/>
                      </div> 
                      <span className="product-policy__title">
                      Hàng chính hãng 100%
                      </span>
                    </div> 
                    <div className="product-policy__item">
                      <div className="product-policy__icon">
                        <BiSolidPhoneCall/>
                      </div> 
                      <span className="product-policy__title">
                        Hotline 1900.17.01.02 hỗ<br/> trợ từ 8h30 - 22h mỗi ngày
                      </span>
                    </div> 
                    <div className="product-policy__item">
                      <div className="product-policy__icon">
                        <FaShippingFast/>
                      </div> 
                      <span className="product-policy__title">
                        Miễn phí vận chuyển
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id='product-single-description' className='product-single__description'>
        <div className="container">
          <div className="product-description">
            <div className="product-description__wrapper">
              <div className="product-icon-features__wrapper">
                <div className="product-icon-features__features">
                  <h3 className="product-icon-features__heading">Chi tiết sản phẩm</h3>
                  <div className="product-icon-features__info">
                    <div>
                      <h4>Thông tin sản phẩm</h4> 
                      <div id="features-listing" className="product-features__listing">
                        {
                          product.description.split('\n').map((a)=>(
                            <div className="product-features__item">
                              {a}
                            </div> 
                          ))
                        }
                      </div>
                    </div> 
                    <div className="product-icon-features__image">
                      <img src={product.color_product[0].images[0].url} alt=""/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="product-suggest-section">
          <div className="container">
            <h4 className="product-suggest-section__title">
              GỢI Ý SẢN PHẨM
            </h4>
            <div className="product-suggest-section-listings">
              <ProductSlider setting={{...settingSlider}} products={product.product_suggest}/>
            </div>
          </div>
        </div>
      </section>
      <section id='review' className='product-single__reviews'>
        <div className="container">
          <h4 className="product-review-section__title">
              ĐÁNH GIÁ SẢN PHẨM
          </h4>
          <div className="reviews">
            <div className="product-rating-overview">
              <div className="product-rating-overview__briefing">
                <div className="reviews-rating-mb__title">
                  <h5>Tổng đánh giá</h5>
                </div> 
                <div className="reviews-rating-mb__rating">
                  {4.2}
                </div> 
                <div data-review-count={102} data-review-avg={4.9} className="reviews-rating">
                    {
                      arr.map((index)=>{
                        if(index <= Math.floor(4.9)){
                          return <div className="reviews-rating__star is-active"></div>
                        }else if(index <= Math.floor(4.9 + 1)){
                          return <div className="reviews-rating__star is-half"></div>
                        }else{
                          return <div className="reviews-rating__star is-empty"></div>
                        }
                      })
                    }
                  </div>
                <div className="reviews-rating-mb__count">
                    {102} đánh giá
                </div>
              </div>
              <div className="product-rating-overview__fillters">
                <div className="product-rating-overview__fillter">
                  tất cả
                </div>
                <div className="product-rating-overview__fillter">
                  5 sao
                </div>
                <div className="product-rating-overview__fillter">
                4 sao
                </div>
                <div className="product-rating-overview__fillter">
                3 sao
                </div>
                <div className="product-rating-overview__fillter">
                2 sao
                </div>
                <div className="product-rating-overview__fillter">
                1 sao
                </div>
                <div className="product-rating-overview__fillter">
                  Có bình luận
                </div>
              </div>            
            </div>
            <div className="reviews-listing">
              <div rel-script="product-reviews-listings" className="grid" data-current-page="1" data-last-page="20" >
                {
                  reviews.map((review, index) =>(
                  <div className="grid__column six-twelfths mobile--one-whole">
                    <div className="reviews-listing__item">
                      <div className="reviews-listing__content">
                        {
                          <div className="reviews-rating">
                            {
                              arr.map((index)=>{
                                if(index <= Math.floor(review.star)){
                                  return <div className="reviews-rating__star is-active"></div>
                                }else if(index <= Math.floor(review.star + 1)){
                                  return <div className="reviews-rating__star is-half"></div>
                                }else{
                                  return <div className="reviews-rating__star is-empty"></div>
                                }
                              })
                            }
                          </div>
                        }
                        <div className="reviews-author">
                          <div className="reviews-author__name">
                              {review.user.username}
                          </div>
                          <div className="reviews-author__description">
                              {
                              review.color_size.map(color_size=>`${color_size.color_name}/${color_size.size_name}`).join(', ')
                              }
                          </div>
                        </div>
                        <div className="reviews-listing__description">
                          <p>
                              {review.comment}
                          </p>
                          <span className="reviews-listing__date">
                            {review.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  ))
                }
              </div>
              <div className="reviews-pagination">      
                <Pagination simple defaultCurrent={1} defaultPageSize={10} total={50} />
              </div>
            </div>              
          </div>
        </div>
      </section>
    </main>
  )
}
export default SingleProduct;