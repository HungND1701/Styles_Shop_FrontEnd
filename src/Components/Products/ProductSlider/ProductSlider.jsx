import './ProductSlider.scss'
import React, {useState} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from '../Product/Product';

const ProductSlider = (props) => {
  const products = [...props.products];
  const [sliderSetting, setSliderSetting] = useState(props.setting ? {...props.setting} : null);

  const settings = {    
    dots: false,
    infinite: true,
    speed: 500,
    centerPadding: "60px",
    slidesToShow: products.length > 4 ? 4: products.length,
    slidesToScroll: products.length > 4 ? 4: products.length,
    autoplay: false,
    className: "grid__column",
    cssEase: "linear",
  };
  const mergedSettings = { ...settings,...sliderSetting };
  return (
    <div className="container container-products">
      <div style={{clear: 'both'}}></div>
      <Slider {...mergedSettings} className='products__slides grid'>
        {products.map((product, index)=>(
          <div key={index} className="grid__column">
            <Product product_data={product}/>
          </div>
        ))}
      </Slider>
    </div>
  )
}
export default ProductSlider;