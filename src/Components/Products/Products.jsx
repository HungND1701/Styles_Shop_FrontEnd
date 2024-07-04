import './Products.scss'
import React, {useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from './Product/Product';

const Products = (props) => {
  const categoryArr = Array.isArray(props.categoryArr) ? props.categoryArr : [];
  const [indexTab, setIndexTab] = useState(0);
  const initialProducts = categoryArr.length > 0 && categoryArr[0].products ? categoryArr[0].products : [];
  const [products, setProducts] = useState(initialProducts);
  useEffect(() => {
    // Cập nhật colorImg mỗi khi selectedColorIndex thay đổi
    setProducts(categoryArr[indexTab].products);
  }, [indexTab]);
  if (categoryArr.length === 0) {
    return <div>No products available</div>;
  }

  const settings = {    
    dots: false,
    infinite: true,
    speed: 500,
    centerPadding: "60px",
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    className: "grid__column",
    cssEase: "linear",
  };


  return (
    <div className="container container-products">
      {(categoryArr.length>1) &&  (
        <div className="homepage-products__tab">
          {categoryArr.map((tab, index)=>(
            <a 
              key={index}
              rel-script="tab-featured-products" 
              data-value={tab.name} 
              className={`homepage-products__tab-item ${index === indexTab ? 'active' : ''}`}
              onClick={() => {
                setIndexTab(index);
              }}
            >
              {tab.name}
            </a> 
          ))}
        </div>
      )} 
      {(categoryArr.length <= 1) &&  (
        <div className="homepage-products__heading">
          {categoryArr[0].name}
          <span>
            <a href="#">Xem thêm</a>
          </span>
        </div>
      )}
      <div style={{clear: 'both'}}></div>
      <Slider {...settings} className='homepage-products__slides grid'>
        {products.map((product, index)=>(
          <div key={index} className="grid__column">
            <Product product_data={product}/>
          </div>
        ))}
      </Slider>
    </div>
  )
}
export default Products;