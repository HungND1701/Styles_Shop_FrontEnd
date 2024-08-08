import React, {useEffect, useState, useContext} from 'react'
import './Review.scss'
import LoadingPopup from '../Loading/LoadingPopup';
import { deleteReviewFromUser, getReviewByUserId } from '../../services/review';
import { Context } from '../../utils/context';
import {Rate , Image, Tooltip, Button} from 'antd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { CgDanger } from "react-icons/cg";
import Popup from '../Popup/Popup';


const Review = () => {
    const {setCurrentMenuAccount} = useContext(Context);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setIsClickAdd, setNotifyContent} = useContext(Context);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [reviewIdSelectedDelete, setReviewIdSelectedDelete] = useState(null);
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data] = await Promise.all([getReviewByUserId()]);
                console.log(data);
                setReviews(data.reviews);
            } catch (error) {
                setReviews([]);
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
    const handleDeleteReview = (id)=>{
        setReviewIdSelectedDelete(id);
        setIsOpenPopupDelete(true);
    }
    const onClosePopupDelete = ()=>{
        setIsOpenPopupDelete(false);
    }
    const SubmitDeleteReview = async(id)=>{
        try {
            await deleteReviewFromUser(id);
            setReviews(reviews.filter(rv => rv.id !== id));
            setIsOpenPopupDelete(false);
            const notify = {
              type: 'success',
              message: "Xóa thành công review",
              content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        } catch (error) {
        const notify = {
            type: 'fail',
            message: "Không thể xóa review",
            content: null,
        }
        setNotifyContent(notify);
        setIsClickAdd(true);
        }
    }
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
                                    <a href={`/product/${review.product.id}`} >
                                        <img src={review.product.imageUrl} alt="" />
                                    </a>
                                    </div>
                                    <div className="order-item-info">
                                    <a href={`/product/${review.product.id}`} >
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
                                    <Button shape="circle" icon={<RiDeleteBin6Line />} style={{opacity: "0.8"}}
                                    onClick={()=>handleDeleteReview(review.id)}
                                    />
                                </Tooltip>
                                <Tooltip title="Sửa" placement="left">
                                    <Button shape="circle" icon={<GrUpdate />} style={{opacity: "0.8"}}/>
                                </Tooltip>
                            </div>        
                        </div>
                        {
                            review.replies.length !== 0 &&(
                                <div className="reply">
                                    <i>Hệ thống</i>
                                    {
                                        review.replies.map((reply,index)=>(
                                            <div key={index} className="review-description">
                                                <p>{reply.content}</p>
                                                {/* <span className='review-date'>{review.formatted_created_at}</span> */}
                                            </div> 
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                ))
                }
            </div>
            </div>
        </div>
        {
          isOpenPopupDelete &&(
            <Popup onClosePopup={onClosePopupDelete}>
              <div className="popup-header-delete" >
                <h2>Xác Nhận Xóa</h2>
                <CgDanger color='red' size='50px'/>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <div className="form-row-delete">
                    <div className="category">
                      ReviewID : 
                      <span>{reviewIdSelectedDelete}</span>
                    </div>
                  </div>
                  <div className="btn-submit">
                    <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                    <Button type="primary" onClick={()=>SubmitDeleteReview(reviewIdSelectedDelete)}>Xác Nhận</Button>
                  </div>
                </div>
              </div>
            </Popup>
          )
        }
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