import './Cart.scss'
import React, {useEffect, useState, useContext}from 'react'
import hanhchinhvn from '../../Assets/tree.json'
import { AutoComplete, Checkbox, Select, Radio, Space, Button} from 'antd'
import { Context } from '../../utils/context'
import { FaRegTrashCan } from "react-icons/fa6"
import { MdLocalShipping } from "react-icons/md"
import momo_icon from "../../Assets/momo-icon.png"
import vnpay_icon from "../../Assets/vnpay_icon.png"
import qr_icon from "../../Assets/qr_icon.png"
import {formatNumber} from '../../services/product'
import {createOrder} from '../../services/order'

const cityArr = Object.keys(hanhchinhvn).sort().map(key =>{
  return {
    id: key,
    value : hanhchinhvn[key].name,
    district : Object.keys(hanhchinhvn[key]["quan-huyen"]).sort().map(i => {
      return {
        id: i,
        value: hanhchinhvn[key]["quan-huyen"][i].name_with_type,
        commune : Object.keys(hanhchinhvn[key]["quan-huyen"][i]["xa-phuong"]).sort().map(j => {
          return {
            id : j, 
            value: hanhchinhvn[key]["quan-huyen"][i]["xa-phuong"][j].name_with_type,
          }
        }),
      }
    }), 
  }
})
const convertFormattedStringToNumber = (str) => {
  // Remove the dots from the formatted string
  const numericString = str.replace(/\./g, '');
  // Convert the resulting string to a number
  return Number(numericString);
};
  // Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
    if (typeof str !== 'string') {
      return ''; // Hoặc một giá trị mặc định khác nếu bạn muốn
    }

    return str
      .normalize('NFD') 
      // .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
      // .replace(/đ/g, 'd') // Replace "đ" with "d"
      // .replace(/Đ/g, 'D') // Replace "Đ" with "D")
      .toLowerCase(); 
};

const Cart = ({onOpenLoginPopup}) => {
  const [district, setDistrict] = useState([]);
  const [commune, setCommune] = useState([]);
  const [valuePayment, setValuePayment] = useState(1);
  const {user, cart, updateProductQuantity, updateProductSizePicked, updateProductColorPicked, updateProductSizeOptions, removeItemFromCart, setIsClickAdd, setNotifyContent} = useContext(Context);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [order, setOrder] = useState({
      user_id: user ? user.id : '', 
      total_price: 0,
      fullname: '',
      address: '', 
      email: '', 
      phone_number: '',
      city: '',
      district: '',
      commune: '',
      note: '', 
      payment_method_id: valuePayment, 
      products: []
  })
  const [selectedProducts, setSelectedProducts] = useState(cart.map(() => true));
  const [selectAll, setSelectAll] = useState(true);

  const getToTalPrice = ()=>{
    let total = 0; 
    let sale = 0;
    const newProducts = [];
    cart.map((product, index)=>{
      if(selectedProducts[index]){
        const new_price = convertFormattedStringToNumber(product.new_price);
        const old_price = convertFormattedStringToNumber(product.old_price);
        total+= new_price*(product.quantity);
        sale+= (old_price-new_price)*(product.quantity);
        
        const product_item = {
          id: product.id,
          color_id: product.colorId_picked,
          size_id: product.sizeId_picked,
          quantity: product.quantity,
          new_price: product.new_price,
          old_price: product.old_price
        }
        newProducts.push(product_item);
      }
    });
    setOrder(prevOrder => ({
      ...prevOrder,
      products: newProducts
    }));
    setTotalPrice(total);
    setTotalSale(sale);
    return total;
  }
  useEffect(() => {
    // Tính toán các tùy chọn kích thước khi product hoặc colorId_picked thay đổi
    cart.map((product, index)=>{
        // Tính toán các tùy chọn kích thước khi product hoặc colorId_picked thay đổi
        const color_product = product.color_product.filter(color => color.color_id === product.colorId_picked); 
        if (color_product.length > 0) {
          const options = color_product[0].sizes.map(sz => ({
            id: sz.size.id,
            value: sz.size.name,
            label: sz.size.name,
          }));
          updateProductSizeOptions(product.id, options);
        } 
    })
  }, []);
  useEffect(()=>{
    const total = getToTalPrice();
    setOrder(prevOrder => ({
      ...prevOrder,
      total_price: total
    }))
  },[cart, selectedProducts]);

  const handleSubmitOrder = async ()=>{
    if(!user){
      onOpenLoginPopup();
    }else{
      try {
          await createOrder(order);
          const notify = {
            type: 'success',
            message: "Đặt hàng thành công",
            content: null,
          }
        setNotifyContent(notify);
        setIsClickAdd(true);
      } catch (error) {
        const notify = {
          type: 'fail',
          message: "Không thể đặt hàng",
          content: null,
        }
        setNotifyContent(notify);
        setIsClickAdd(true);
      }
    }
  }

  const handleCitySelected= (value, option)=> {
    setOrder(prevOrder=>({
      ...prevOrder,
      city: value
    }))
    setDistrict(option.district);
  }
  const handleDistrictSelected= (value, option)=> {
    setOrder(prevOrder=>({
      ...prevOrder,
      district: value
    }))
    setCommune(option.commune);
  }
  const handleCommuneSelected= (value, option)=> {
    setOrder(prevOrder=>({
      ...prevOrder,
      commune: value
    }))
  }

  const onChangePayment = (e) => {
    setOrder(prevOrder=>({
      ...prevOrder,
      payment_method_id: e.target.value
    }))
    setValuePayment(e.target.value);
  };
  const onChangeAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedProducts(cart.map(() => checked));
  };

  const onChangeOne = (index) => (e) => {
    const checked = e.target.checked;
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = checked;
    setSelectedProducts(newSelectedProducts);
    setSelectAll(newSelectedProducts.every((selected) => selected));
  };

  const handleColorChange = (product_id, value, color ) => {
    updateProductColorPicked(product_id, value, color);
  };
  const handleSizeChange = (product_id, value) => {
    updateProductSizePicked(product_id, value);
  };

   // Hàm xử lý khi nhấn nút giảm
   const handleReduce = (e, product_id, quantity) => {
    e.preventDefault();
    updateProductQuantity(product_id, quantity-1)
  };

  // Hàm xử lý khi nhấn nút tăng
  const handleAugment = (e, product_id, quantity) => {
    e.preventDefault(e);
    updateProductQuantity(product_id, quantity+1)
  };

  // Hàm xử lý khi thay đổi giá trị ô input
  const handleChangeQuantity = (e, product_id) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateProductQuantity(product_id, value)
    }
  };

  const handleChangeForm = (e) =>{
    const {name, value} = e.target;
    setOrder(prevOrder=>({
      ...prevOrder,
      [name]: value
    }));
  }

  
  return (
    <div className="site-content">
      <div className="container">
        <div className="grid flex">
          <div className="grid__column seven-twelfths cart-left-section cart-v2">
            <div className="cart-section">
              <div className="title-with-actions">
                <div className="title">Thông tin vận chuyển</div>
              </div>
              <div id='customer-info-block' customerinfo=''> 
                <div className="grid flex">
                  <div className="grid__column six-twelfths">
                    <label className="text-gray-light"> Họ và tên</label> 
                    <input type="text" name="fullname" placeholder="Nhập tên của bạn" className="form-control" onChange={handleChangeForm}/> 
                  </div>
                  <div className="grid__column six-twelfths">
                    <label className="text-gray-light">Số điện thoại</label> 
                    <input type="tel" name="phone_number" placeholder="Nhập số điện thoại của bạn" className="form-control" onChange={handleChangeForm}/>
                  </div>
                </div>
                <div className="grid">
                  <div className="grid__column">
                    <label className="text-gray-light">Email</label> 
                    <input type="email" name="email" placeholder="Nhập Email của bạn" className="form-control" onChange={handleChangeForm}/> 
                  </div>
                  <div className="grid__column">
                    <div className="address-block">
                      <label className="text-gray-light">Địa chỉ</label> 
                      <input type="text" name="address" placeholder="Địa chỉ " autocomplete="off" className="form-control" onChange={handleChangeForm}/> 
                    </div>
                  </div>
                </div>
                <div className="grid">
                  <div className='grid__column four-twelfths '>
                    <AutoComplete
                      style={{
                        width: '100%',
                        height: '40px',
                      }}
                      options={cityArr}
                      onSelect = {(value, option)=>handleCitySelected(value, option)}
                      placeholder="Chọn Tỉnh/Thành Phố"
                      filterOption={(inputValue, option) =>
                        {
                          const inputValueNormalized = removeVietnameseTones(inputValue);
                          const optionValueNormalized = removeVietnameseTones(option.value);
                          return optionValueNormalized.startsWith(inputValueNormalized);
                        }
                      }
                    />
                  </div>
                  <div className='grid__column four-twelfths '>
                    <AutoComplete
                      style={{
                        width: '100%',
                        height: '40px',
                      }}
                      options={district}
                      onSelect = {(value, option)=>handleDistrictSelected(value, option)}
                      placeholder="Chọn Quận/Huyện"
                      filterOption={(inputValue, option) =>
                        {
                          const inputValueNormalized = removeVietnameseTones(inputValue);
                          const optionValueNormalized = removeVietnameseTones(option.value);
                          return optionValueNormalized.startsWith(inputValueNormalized);
                        }
                      }
                    />
                  </div>
                  <div className='grid__column four-twelfths '>
                    <AutoComplete
                      style={{
                        width: '100%',
                        height: '40px',
                      }}
                      options={commune}
                      onSelect = {(value, option)=>handleCommuneSelected(value, option)}
                      placeholder="Chọn Phường/Xã"
                      filterOption={(inputValue, option) =>
                        {
                          const inputValueNormalized = removeVietnameseTones(inputValue);
              
                          const optionValueNormalized = removeVietnameseTones(option.value);
                    
                          return optionValueNormalized.startsWith(inputValueNormalized);
                        }
                      }
                    />
                  </div>
                </div>
                <div className="grid">
                  <div data-v-29a714fd="" className="grid__column">
                    <input type="text" name="note" placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)" className="form-control" onChange={handleChangeForm}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-section cart-payment-scroll">
              <div className="title">Hình thức thanh toán</div>
              <div className="payment-shipping">
                <form action="">
                  <div className="mgb-20 active">
                    <Radio.Group onChange={onChangePayment} value={valuePayment} >
                      <Space direction="vertical">
                        <Radio value={1} className={`payment-method__item ${valuePayment === 1 ? 'active' : ''}`}>
                          <div className="payment-method__content">
                            <span className="payment-method__item-icon-wrapper">
                              <MdLocalShipping />
                            </span>
                            <span className="payment-method__item-name">
                              COD <br/>Thanh toán khi nhận hàng
                            </span>
                          </div>
                        </Radio>
                        <Radio value={2} className={`payment-method__item ${valuePayment === 2 ? 'active' : ''}`}>
                          <div className="payment-method__content">
                            <span className="payment-method__item-icon-wrapper">
                              <img src={vnpay_icon} alt="" />
                            </span>
                            <span className="payment-method__item-name">
                              Ví điện tử VNPAY/VNPAY QR
                            </span>
                          </div>
                        </Radio>
                        <Radio value={3} className={`payment-method__item ${valuePayment === 3 ? 'active' : ''}`}>
                          <div className="payment-method__content">
                            <span className="payment-method__item-icon-wrapper">
                              <img src={momo_icon} alt="" />
                            </span>
                            <span className="payment-method__item-name">
                              Thanh Toán MoMo
                            </span>
                          </div>
                        </Radio>
                        <Radio value={4} className={`payment-method__item ${valuePayment === 4 ? 'active' : ''}`}>
                          <div className="payment-method__content">
                            <span className="payment-method__item-icon-wrapper">
                              <img src={qr_icon} alt="" />
                            </span>
                            <span className="payment-method__item-name">
                              Chuyển khoản liên kết ngân hàng bằng QR Code <br/>
                              Chuyển tiền qua ví điện tử (MoMo,Zalopay,...)
                            </span>
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='grid__column five-twelfths cart-right-section'>
            <div className="cart-section">
              <div className="title">
                Giỏ hàng
              </div>
              <div>
                <div className="cart-items__header">
                  <span className='flex'>
                    <Checkbox onChange={onChangeAll} checked={selectAll}></Checkbox>
                    Tất cả sản phẩm
                  </span>
                  <span>Số lượng</span>
                  <span>Giá</span>
                </div>
                <div className="cart-items">
                  {
                    cart.map((product, index)=>(
                      <div key={index} className="group-item">
                        <div className="cart-item">
                          <div className="checkbox-item-cart">
                            <div className="cart-item_multiselect">
                              <Checkbox key={index} onChange={onChangeOne(index)} checked={selectedProducts[index]} ></Checkbox>
                            </div>
                          </div>
                          <div className="cart-item-thumbnail">
                            <div className="cart-item-thumbnail__image">
                              <div className="cart-item__thumbnail-block">
                                <img src={product.img} alt={product.name} />
                              </div>
                            </div>
                          </div>
                          <div className="cart-item-content">
                            <div className="cart-item-content__wrapper">
                              <div className="cart-item-content__inner" style={{opacity: '1', pointerEvents: 'auto'}}>
                                <h3 className="cart-item__title">
                                  <a href={`/product/${product.id}`} target="_blank">{product.name}</a> 
                                </h3>
                                <div className="cart-item__variant">{product.color_picked + "/" + product.size_picked}</div>
                              </div>
                              <div className="cart-item-actions">
                                <div className="cart-item-selects">
                                  <Select
                                    defaultValue={product.color_picked}
                                    style={{
                                      width: 120,
                                    }}
                                    onChange={(value, option)=> handleColorChange(product.id, value, option.label)}
                                    options={product.color_product.map((cl,index) => ({
                                      value: cl.color.name,
                                      label: cl.color.name,
                                    }))}
                                  />
                                  <Select
                                    defaultValue={
                                      (product.sizeOptions && product.sizeOptions.length > 0)
                                        ? product.sizeOptions.filter(sz => sz.id === product.sizeId_picked)[0].value
                                        : undefined
                                    }
                                    style={{
                                      width: 100,
                                    }}
                                    onChange={(value)=> handleSizeChange(product.id, value)}
                                    options={product.sizeOptions}
                                  />
                                </div>
                                <div className="cart-item-quantity">
                                  <div rel-script="quantity-change" className="quantity-box">
                                    <a href="#" className="quantity__reduce" onClick={(e)=>handleReduce(e, product.id, product.quantity)}>-</a> 
                                    <input
                                      type="number"
                                      value={product.quantity}
                                      max="99"
                                      min="1"
                                      className="quantity__control"
                                      onChange={(e)=>handleChangeQuantity(e,product.id)}
                                    />
                                    <a href="#" className="quantity__augure" onClick={(e)=>handleAugment(e, product.id, product.quantity)}>+</a>
                                  </div>
                                </div>
                                <div className="cart-item-price">
                                  <span>{formatNumber(convertFormattedStringToNumber(product.new_price)*product.quantity) + "đ"}</span>
                                  <del>{product.price*product.quantity + "đ"}</del>
                                </div>
                              </div>
                              <button className="cart-item-remove" onClick={()=>{
                                selectedProducts.filter((_, i) => i !== index);
                                removeItemFromCart(index);
                                }}>
                                <FaRegTrashCan />
                                <span>Xóa</span>    
                              </button>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div> 
            <div className="pricing-info">
              <div className="pricing-info__item">
                <p>Tạm tính</p> 
                <p className="pricing-info__sub">
                  <span>{formatNumber(totalPrice) + "đ"}</span> 
                  <span className="pricing-info__saving">
                    <i>(tiết kiệm <span className="text--primary">{formatNumber(totalSale)+'đ'})</span></i>
                  </span>
                </p>
              </div>
              <div className="pricing-info__item">
                <p>Giảm giá</p> 
                <p className="">
                  <span className="price_text">0đ</span>
                </p>
              </div>
              <div className="pricing-info__item">
                <p>Phí giao hàng</p> 
                <p className="">
                  <span>Miễn phí</span>
                </p>
              </div>
              <div className="divider"></div>
              <div className="pricing-info__item pricing-info__total">
                <p className="pricing-info__total_title">
                  Tổng
                </p>
                <p className="">
                  <span className="pricing-info__total total">{formatNumber(totalPrice) + "đ"}</span> 
                  <span className="text-xs block discount-r discount-r">
                    (Đã giảm {formatNumber(totalSale) + "đ"} trên giá gốc)
                  </span>
                </p>
              </div>
              <div className="divider"></div>
              <div className="pricing-info__item">
                <div></div>
                <div>
                  <button className='cash-btn' onClick={()=>handleSubmitOrder()}>
                    ĐẶT HÀNG
                  </button>
                </div>
              </div>
            </div>         
          </div>
        </div>
      </div>
    </div>
  )
}
export default Cart;
