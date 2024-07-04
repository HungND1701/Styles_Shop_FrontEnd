import React, {useEffect, useState, useContext} from 'react'
import './Review.scss'
import LoadingPopup from '../Loading/LoadingPopup';
import { getReviewByUserId } from '../../services/review';
import { Context } from '../../utils/context';
import {Rate , Image, Tooltip, Button} from 'antd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";




const formatNumber = (num) => {
    
    const parsedNumber = parseFloat(num);  // Chuyển đổi chuỗi thành số
    if (isNaN(parsedNumber)) {
      return "Invalid number";
    }
    return parsedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
});

const Review = () => {
    const {user, setCurrentMenuAccount} = useContext(Context);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data] = await Promise.all([getReviewByUserId()]);
                console.log(data);
                setReviews(data.reviews);
            } catch (error) {
                setReviews([]);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        setCurrentMenuAccount('3');
      }, []);
    if (loading) {
        return <LoadingPopup/>
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
  return (
    <div>
        <h3 class="account-page-title">
            Đánh giá sản phẩm
        </h3>
        <div>
            <div class="account-page__label">
                Bạn có<span> {reviews.length} đánh giá</span>
            </div>
            <div className="orders-body mgt--10">
            <div className="orders-wrapper">
                {
                reviews.length === 0 ? <></> :
                reviews.map((review, index)=>(
                    <div className='order'>
                        <a href={`/get-order/${review.order_id}`} class="order-header">
                            <div>
                                <p class="order-title">
                                Đơn hàng #{review.order_id}
                                </p> 
                                <p class="order-date" >
                                    {review.formatted_created_at_Order}
                                </p>
                            </div> 
                            <div > 
                                
                            </div>
                        </a>
                        <div className="order-body-review">
                            <div>
                                <div className="order-item">
                                    <div className="order-item-thumbnail">
                                    <a href={`/product/${review.product.id}`} target='_blank'>
                                        <img src={review.product.imageUrl} alt="" />
                                    </a>
                                    </div>
                                    <div className="order-item-info">
                                    <a href={`/product/${review.product.id}`} target='_blank'>
                                        {review.product.name}
                                    </a>
                                    <div data-v-451fd4eb="" class="order-item-variant-label">
                                        {
                                            review.product.color+'/'+review.product.size
                                        }
                                    </div>
                                    <div data-v-451fd4eb="" class="order-item-quantity">
                                        {
                                            "x"+review.product.pivot.quantity
                                        }
                                    </div>
                                    <div data-v-451fd4eb="" class="order-item-price">
                                        {review.product.pivot.new_price + ' đ'}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="review">
                            <div className="review-content">
                                <div className="rate">
                                    <Rate disabled defaultValue={review.rating}/>
                                </div>   
                                <div className="review-images">
                                    {
                                        review.images.map((img)=>(
                                            <Image
                                                height={100}
                                                src={img.url}
                                                onPreview={handlePreview}
                                            />
                                        ))
                                    }
                                    
                                </div>      
                                <div className="review-description">
                                    <p>{review.review}</p>
                                    <span className='review-date'>{review.formatted_created_at}</span>
                                </div> 
                            </div>
                            <div className="review-actions">
                                <Tooltip title="Xóa" placement="left">
                                    <Button shape="circle" icon={<RiDeleteBin6Line />} style={{opacity: "0.8"}}/>
                                </Tooltip>
                                <Tooltip title="Sửa" placement="left">
                                    <Button shape="circle" icon={<GrUpdate />} style={{opacity: "0.8"}}/>
                                </Tooltip>
                            </div>        
                        </div>
                    </div>
                ))
                }
            </div>
            </div>
        </div>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
    </div>
  )
}

export default Review