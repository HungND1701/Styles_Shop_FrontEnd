import React, {useEffect, useState, useContext} from 'react'
import LoadingPopup from '../../Loading/LoadingPopup'
import {getOrderByUserId} from '../../../services/order'
import { Context } from '../../../utils/context';
import Popup from '../../Popup/Popup';
import {Form, Rate, Upload, Input, Button, Image } from 'antd';
import { IoMdCheckmark } from "react-icons/io";
import { PlusOutlined } from '@ant-design/icons';
import {deleteFile} from '../../../services/upload';
import { createReview } from '../../../services/review';
const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
});

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};

const formatNumber = (num) => {
    
    const parsedNumber = parseFloat(num);  // Chuyển đổi chuỗi thành số
    if (isNaN(parsedNumber)) {
      return "Invalid number";
    }
    return parsedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const formItemLayout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 20,
    },
};
const getTokenFromLocalStorage = () => {
    return sessionStorage.getItem('token'); 
};
const OrderHistory = () => {
    const {user, setCurrentMenuAccount, setIsClickAdd, setNotifyContent} = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderReview, setOrderReview] = useState(null);
    const [isOpenPopupReview, setIsOpenPopupReview] = useState(false);
    const [valueRate, setValueRate] = useState(3);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data] = await Promise.all([getOrderByUserId()]);
                console.log(data);
                setOrders(data);
            } catch (error) {
                setOrders([]);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        setCurrentMenuAccount('2');
      }, []);
    if (loading) {
        return <LoadingPopup/>
    }

    const handleReview = (order) => {
        setOrderReview(order);
        setIsOpenPopupReview(true);
    }

    const onClosePopup = ()=>{
        setIsOpenPopupReview(false)
    }

    const onFinish = async (order_id, product_id, values) => {
        console.log('Received values of form: ', order_id);
        console.log('Received values of form: ', product_id);
        console.log('Received values of form: ', values);
        const request = {
            product_id: product_id,
            order_id: order_id,
            rating: values.rate,
            review: values.review,
            images: values.images.map((file)=>({url: file.response})),
        }
        try {
            const response = await createReview(request);

            // Cập nhật orderReview.products với review mới
            const updatedProducts = orderReview.products.map(product => {
                if (product.id === product_id) {
                    return { ...product, review: response.review };
                }
                return product;
            });

            // Cập nhật orderReview state
            setOrderReview(prevOrderReview => ({
                ...prevOrderReview,
                products: updatedProducts,
            }));
            const notify = {
                type: 'success',
                message: response.message,
                content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        } catch (error) {
            const notify = {
                type: 'fail',
                message: "Không thể tạo đánh giá",
                content: null,
              }
              setNotifyContent(notify);
              setIsClickAdd(true);
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleRemoveFile = async (file)=> {
        const url = file.response;
        const request = {
            url: url,
        };
        try {
            const response = await deleteFile(request);
            console.log(response);
            return true;
        } catch (error) {
            return false;
        }
        
    }
  return (
    <div>
        <h3 class="account-page-title">
            Lịch sử đơn hàng
        </h3>
        <div>
            <div class="account-page__label">
            Đơn hàng của bạn<span data-v-6cd98ade="">: {orders.length} đơn hàng</span>
            </div>
            <div className="orders-body mgt--10">
            <div className="orders-wrapper">
                {
                orders.map((order, index)=>(
                    <a href={`/get-order/${order.id}`} className='order'>
                        <div class="order-header">
                            <div>
                            <p class="order-title">
                                #{order.id}
                            </p> 
                            <p class="order-date" >
                                {order.formatted_created_at}
                            </p>
                            </div> 
                            <div class={`order-status-badge ${order.statuses[0].name === "Hoàn thành" ? "order-status-badge-done": ""} ${order.statuses[0].name === "Đã Hủy" ? "order-status-badge-canceled": ""}`}> 
                            <span data-v-6cd98ade="">{order.statuses[0].name}</span>
                            </div>
                        </div>
                        <div className="order-body">
                            <div>
                            {
                                order.products.map((product, index) => (
                                <div className="order-item">
                                    <div className="order-item-thumbnail">
                                    <a href={`/product/${product.id}`} target='_blank'>
                                        <img src={product.imageUrl} alt="" />
                                    </a>
                                    </div>
                                    <div className="order-item-info">
                                    <a href={`/product/${product.id}`} target='_blank'>
                                        {product.name}
                                    </a>
                                    <div data-v-451fd4eb="" class="order-item-variant-label">
                                        {
                                            product.color+'/'+product.size
                                        }
                                    </div>
                                    <div data-v-451fd4eb="" class="order-item-quantity">
                                        {
                                            "x"+product.pivot.quantity
                                        }
                                    </div>
                                    <div data-v-451fd4eb="" class="order-item-price">
                                        {product.pivot.new_price + ' đ'}
                                    </div>
                                    </div>
                                </div>
                                ))
                            }
                            </div>
                        </div>
                        <div className="order-footer">
                            <div className="order-footer__left">
                            <div >
                                <a href="https://zalo.me/0876548683" target="_blank" class="btn btn--outline">Cần hỗ trợ</a> 
                                <a class="btn btn--black"> Mua lại </a>
                                {
                                    (order.statuses[0].name === "Hoàn thành" && !order.products.every(product => product.review !== null)) && (
                                        <a class="btn btn--black" onClick={(e) => {
                                            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
                                            e.stopPropagation(); // Ngăn chặn sự kiện lan ra thẻ cha
                                            handleReview(order);
                                        }} > Đánh giá </a>
                                    )
                                }
                                {
                                    (order.statuses[0].name === "Hoàn thành" && order.products.every(product => product.review !== null)) && (
                                        <a class="btn btn--black" style={{backgroundColor: "#ddd", border: "0px", color: "#161616"}}> Đã đánh giá </a>
                                    )
                                }
                            </div>
                            </div>
                            <div className="order-footer__right">
                            <div>
                                <b>{formatNumber(order.total_price) + ' đ'}</b>
                            </div>
                            </div>
                        </div>
                    </a>
                ))
                }
            </div>
            </div>
        </div>
        {
            isOpenPopupReview && 
            (
                <Popup onClosePopup={onClosePopup}>
                    <div className="rateProduct">
                        <h3 className='account-page-title'> 
                            Đánh giá sản phẩm
                        </h3>
                        <div className="mgt--20"> 
                            {
                                orderReview.products.map((product, index) => 
                                (
                                    orderReview.length === 0 ? <>abc</> :  
                                    <div className="order-body-review">
                                        <div className="order-item">
                                            <div className="order-item-thumbnail">
                                            <a href={`/product/${product.id}`} target='_blank'>
                                                <img src={product.imageUrl} alt="" />
                                            </a>
                                            </div>
                                            <div className="order-item-info">
                                            <a href={`/product/${product.id}`} target='_blank'>
                                                {product.name}
                                            </a>
                                            <div data-v-451fd4eb="" class="order-item-variant-label">
                                                {
                                                    product.color+'/'+product.size
                                                }
                                            </div>
                                            <div data-v-451fd4eb="" class="order-item-quantity">
                                                {
                                                    "x"+product.pivot.quantity
                                                }
                                            </div>
                                            <div data-v-451fd4eb="" class="order-item-price">
                                                {product.pivot.new_price + ' đ'}
                                            </div>
                                            </div>
                                        </div>
                                        {
                                            !product.review && (
                                                <div className="rate">
                                                    <Form
                                                        key={product.id}
                                                        name={`review_${product.id}`}
                                                        {...formItemLayout}
                                                        onFinish={(values)=>onFinish(orderReview.id, product.id, values)}
                                                        initialValues={{
                                                        rate: 3,
                                                        }}
                                                    >
                                                        <Form.Item name="rate" label="Sao">
                                                            <Rate />
                                                        </Form.Item>
                                                        <Form.Item 
                                                        name = "images"
                                                        label="Ảnh" 
                                                        valuePropName="fileList" getValueFromEvent={normFile}>
                                                            <Upload 
                                                                multiple={true}
                                                                onPreview={handlePreview}
                                                                listType="picture-card"
                                                                action="http://127.0.0.1:8000/api/uploads/storeImagesReview"
                                                                onRemove={handleRemoveFile}
                                                                headers={{
                                                                    Authorization: `Bearer ${getTokenFromLocalStorage()}`, 
                                                                }}
                                                            >
                                                                <button
                                                                    style={{
                                                                        border: 0,
                                                                        background: 'none',
                                                                    }}
                                                                    type="button"
                                                                >
                                                                <PlusOutlined />
                                                                <div
                                                                    style={{
                                                                    marginTop: 8,
                                                                    }}
                                                                >
                                                                    Tải lên
                                                                </div>
                                                                </button>
                                                            </Upload>
                                                        </Form.Item>
                                                        <Form.Item name="review" label="Đánh giá">
                                                            <TextArea
                                                                placeholder="Nhập đánh giá của bạn"
                                                                autoSize={{
                                                                minRows: 2,
                                                                maxRows: 6,
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            wrapperCol={{
                                                                ...formItemLayout.wrapperCol,
                                                                offset: 20,
                                                            }}
                                                            >
                                                            <Button type="primary" htmlType="submit">
                                                                Submit
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>

                                                </div>
                                            )
                                        }
                                        {
                                            product.review && (
                                                <div className="rate">
                                                    <div className="reviewed">
                                                        <IoMdCheckmark /> <span> Đã đánh giá</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))   
                            }
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

export default OrderHistory