import React, {useState, useEffect, useContext} from 'react'
import './OrderAdminDetail.scss'
import { Steps } from 'antd';
import { getOrderById } from '../../../../services/order'; 
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../../../Components/Admin/Loading/Loading'; 
import Error from '../../../../Components/Admin/Error/Error';
import { Context } from '../../../../utils/context'; 

const formatNumber = (num) => {
    
    const parsedNumber = parseFloat(num);  // Chuyển đổi chuỗi thành số
    if (isNaN(parsedNumber)) {
      return "Invalid number";
    }
    return parsedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const OrderAdminDetail = () => {
    const { id } = useParams();
    const {parseNumber, formatCurrency} = useContext(Context);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCost , setTotalCost] = useState(0);
    const [totalSale , setTotalSale] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data] = await Promise.all([getOrderById(id)]);
                console.log(data);
                setOrder(data);
            } catch (error) {
                setOrder([]);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
      }, []);

      useEffect(() => {
        if(order){
            setTotalCost(0);
            setTotalSale(0);
            order.products.map((product)=>{
                getTotalCost(product.pivot.old_price, product.pivot.new_price, product.pivot.quantity);
            })
        }
      }, [order]);
    if (loading) {
        return <Loading/>
    }
    if (error) {
        return <Error/>
    }
    const getTotalCost = (old_price,new_price,  quantity)=>{
        const oldPrice= parseNumber(old_price);
        const sale = oldPrice - parseNumber(new_price) ;
        setTotalCost((prev) => prev + oldPrice*quantity);
        setTotalSale((prev) => prev + sale*quantity);
    }

  return (
    <main>
        <div className="container-admin">
            <div className="container-admin__inner order-admin">
                <div className="account-page__content">
                    <div id="detail-order">
                        <div className="thank-box" style={{padding: '0px'}}>
                            <div class="detail-order">
                                <h1 class="detail-order-heading">Thông tin đơn hàng #{order.id}</h1> 
                                <div class="detail-order-status">  {order.statuses[0].name}</div>
                            </div>
                            <div class="detail-order-info">
                                <ul class="detail-order-info__list">
                                    <li>
                                        <div class="detail-order-info__title">Ngày đặt hàng:</div> 
                                        <div class="detail-order-info__content">{order.formatted_created_at}</div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Tên người nhận</div> 
                                        <div class="detail-order-info__content">
                                            {order.fullname}
                                        </div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Địa chỉ Email:</div> 
                                        <div class="detail-order-info__content">
                                            {order.email}
                                        </div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Số điện thoại:</div> 
                                        <div class="detail-order-info__content">
                                            {order.phone_number}
                                        </div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Phương thức thanh toán:</div> 
                                        <div class="detail-order-info__content payment-selected-old">
                                            {order.payment_method.name}
                                        </div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Địa chỉ giao hàng:</div> 
                                        <div class="detail-order-info__content">
                                            {order.address +', ' + order.commune + ', ' + order.district + ', ' + order.city}                
                                        </div>
                                    </li> 
                                    <li>
                                        <div class="detail-order-info__title">Ghi chú:</div> <div class="detail-order-info__content">
                                            {order.note}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/* <div class="grid detail-order-button">
                                <div class="grid__column">
                                    <div class="order-date" style={{justifyContent: "flex-start"}}>
                                        <div class="detail-order-cta">
                                            <a href="https://zalo.me/0876548683" target="_blank" class="btn btn--outline repurchase-btn">Cần hỗ trợ</a> 
                                            <a rel-script="order-repurchase" class="btn btn--black repurchase-btn">Mua lại</a>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <h2 class="lookup-order-result__heading">Tình trạng đơn hàng</h2>
                            <section className="lookup-order-history__timeline">
                                <Steps
                                    progressDot
                                    current={1}
                                    direction="vertical"
                                    items={
                                        order.statuses.map((sts, index)=>{
                                            if(index === 0) return {
                                                title: sts.name,
                                                subTitle: sts.formatted_created_at,
                                                status: 'finish',
                                                description: sts.description,
                                            }
                                            return {
                                                title: sts.name,
                                                subTitle: sts.formatted_created_at,
                                                status: 'wait',
                                                description: sts.description,
                                            }
                                        })
                                    }
                                />
                            </section>
                            <table class="table" style={{textAlign: "center"}}>
                                <thead>
                                    <tr>
                                        <th>Tên sản phẩm</th> 
                                        <th>Số lượng</th> 
                                        <th width="120px">Giá niêm yết</th> 
                                        <th width="100px">Biến thể</th> 
                                        <th class="text--right">Thành tiền</th>
                                    </tr>
                                </thead> 
                                <tbody>
                                    {   
                                        order.products.map((product)=>(
                                            <tr>
                                                <td class="text--left">
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        <div class="detail-order-item__thumbnail">
                                                            <img src={product.imageUrl}/>
                                                        </div> 
                                                        <div class="detail-order-item__title">
                                                                {product.name}<br/>
                                                        </div>
                                                    </div>
                                                </td> 
                                                <td>{product.pivot.quantity}</td> 
                                                <td>{product.pivot.old_price + "đ"}</td> 
                                                <td>{product.color + "/" + product.size}</td> 
                                                <td style={{padding: '10px 20px'}}>{
                    
                                                formatCurrency(parseNumber(product.pivot.old_price)*product.pivot.quantity) + "đ"
                                                }</td>
                                            </tr> 
                                        ))
                                    }
                                </tbody> 
                                <tfoot>
                                    <tr>
                                        <td colspan="2">
                                    Mã giảm giá
                                        </td> 
                                        <td colspan="3">
                                    ******50
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td colspan="2">
                                    Tổng giá trị sản phẩm
                                        </td> 
                                        <td colspan="3">
                                    {formatCurrency(totalCost)+"đ"}
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td colspan="4">
                                        Tổng khuyến mãi
                                        </td> 
                                        <td>
                                        {"-" + formatCurrency(totalSale) + "đ"}
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td colspan="4">Phí giao hàng</td> 
                                        <td>0đ</td>
                                    </tr> 
                                    <tr class="total_payment">
                                        <td colspan="2">
                                    Tổng thanh toán
                                        </td> 
                                        <td colspan="3">
                                        {formatNumber(order.total_price) + ' đ'}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default OrderAdminDetail