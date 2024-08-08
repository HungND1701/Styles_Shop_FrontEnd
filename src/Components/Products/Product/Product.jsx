import './Product.scss'
import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../../utils/context';
import {getNewPrice, formatNumber} from '../../../services/product';

const Product = (props) => {
  const product = props.product_data;
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const {addItemToCart, setIsClickAdd} = useContext(Context);
  const [rateAverage, setRateAverge] = useState(5);
  const [reviewCount, setReviewCount] = useState(0);
  // Truy cập đúng vào sản phẩm đầu tiên trong mảng products
  const initialColorProduct = product.color_product[selectedColorIndex];
  const [colorProduct, setColorProduct] = useState(initialColorProduct);

  const handleQuickAddToCart=(index) =>{
    const item = {
      ...product,
      color_picked: product.color_product[selectedColorIndex].color.name,
      size_picked: product.color_product[selectedColorIndex].sizes[index].size.name,
      colorId_picked: product.color_product[selectedColorIndex].color.id,
      sizeId_picked: product.color_product[selectedColorIndex].sizes[index].size.id,
      img : product.color_product[selectedColorIndex].images[0].url,
      new_price: getNewPrice(product.price, product.sale),
      old_price: formatNumber(product.price),
      quantity: 1,
    }
    setIsClickAdd(true);
    addItemToCart(item);
  }
  useEffect(() => {
    // Cập nhật colorImg mỗi khi selectedColorIndex thay đổi
    setColorProduct(product.color_product[selectedColorIndex]); 
  }, [selectedColorIndex, product]);

  useEffect(()=>{
    setSelectedColorIndex(0);
    if(Array.isArray(product.reviews) && product.reviews.length !== 0 ){
      const reviewCount = product.reviews.length;
      setReviewCount(reviewCount);
      let total = 0
      product.reviews.map(rv=>{total = total+rv.rating})
      setRateAverge(total/reviewCount);
    }
  }, [product]);

  return (
    <div className="product-grid product option-changed" >
      <div className="product-grid__thumbnail coolactive-tag">
        <div className="product-grid__image" rel-script="product-grid-thumbnails">
          <a href={`/product/${product.id}`} tabindex="0">
              <img loading="lazy" src={colorProduct.images[0].url}  className="home-banner"/>
              {
                colorProduct.images.length >= 2 && (
                  <img 
                    className="hover"
                    loading="lazy" 
                    src={colorProduct.images[1].url} 
                  />
                )
              }
          </a>
        </div>
          
        <span style={{backgroundColor: product.tag.name==="new" ? '#2F5ACF' : ''}} className="product-grid__tags product-grid__tags--sale">{product.tag.name}</span>
        <div className="product-grid__reviews">
          <div className="reviews-rating" >
            <div className="">{rateAverage}</div>
            <div className="reviews-rating__star"></div>
            <div className="reviews-rating__number">
              ({reviewCount})
            </div>
          </div>
        </div>
        <div className={`product-grid__select`}>
          <p>Thêm nhanh vào giỏ hàng +</p>
          <form action="" >
            <div className="option-select" data-option-id="color" data-option-index="1">
              {product.color_product.map((color_prd, index)=>(
                <label key={index} className="option-select__item" style={{display: 'none'}}>
                  <input type="radio" name="color" value={color_prd.color.name} checked="" tabIndex="0" onClick={()=>setSelectedColorIndex(index)}/>
                </label>
              ))}
            </div>
            <div id='option-select-size' className="option-select" data-option-id="size" data-option-index="2">
              {colorProduct.sizes.map((size, index)=>(
                  <label key={index} className="option-select__item" style={{}}>
                    <input type="radio" name="undefined" value={size.size.name} tabIndex="0" onClick={()=> handleQuickAddToCart(index)}/>
                    <span className="checkmark">{size.size.name}</span>
                  </label>
              ))}
            </div>
          </form>
        </div>
      </div>
      <div className="product-grid__content" >
          <div className="product-grid__options">
              <div className="options-color" data-option-id="color">
                {product.color_product.map((colorPrd, index) => (
                    <div 
                      key={index} 
                      className={`option-color__item ${index === selectedColorIndex ? 'is-current' : ''}`} 
                      rel-script="product-grid-color-change" 
                      data-value={colorPrd.color.name} 
                      data-title={colorPrd.color.name}
                      onClick={() => setSelectedColorIndex(index)}
                    >
                      <span className="checkmark" style={{backgroundColor: `${colorPrd.color.code}`}}></span>
                    </div>
                  ))}
              </div>
          </div>
          <h3 className="product-grid__title">
              <a href="#" rel-script="product-grid-title" tabindex="0">
                  {product.name}
              </a>
          </h3>
          <div className="product-grid__prices">
            <div className="product-prices " rel-script="product-grid-price">
                <del>{formatNumber(product.price)} đ</del><span>{product.sale}</span><ins>{getNewPrice(product.price, product.sale)} đ</ins>
            </div>
          </div>
      </div>
    </div>
  )
}
export default Product;