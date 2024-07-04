import React from 'react';
import './Banner.scss'
import ImageSlider from "../../ImageSlider/ImageSlider";

const Banner = ({banners}) => {
  return (
    <div className='banner-slide slick-initialized slick-slider'>
       <ImageSlider images={banners} />
    </div>
  )
}
export default Banner;