import './SearchItem.scss'
import React, { useState, useEffect, useContext } from 'react';
import {getNewPrice, formatNumber} from '../../../services/product';

const SearchItem = (props) => {
  const product = props.product_data;

  return (
    <div className="product-grid product option-changed" >
      <div className="product-grid__thumbnail coolactive-tag">
        <div className="product-grid__image">
          <a href={`/product/${product.id}`} >
              <img loading="lazy" src={product.imageUrl}  className="home-banner"/>
          </a>
        </div>
        <span className="product-grid__tags product-grid__tags--sale">{product.tag}</span>
      </div>
      <div className="product-grid__content" >
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
export default SearchItem;