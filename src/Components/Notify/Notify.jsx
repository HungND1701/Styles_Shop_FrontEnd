import './Notify.scss'
import React, { useContext, useState } from 'react'
import { Context } from '../../utils/context';

const Notify = () => {

    const {notifyContent, isOpenNotify, setIsOpenNotify} = useContext(Context);
    return (
    <div className={`notify ${isOpenNotify ? 'is-actice' : ""} ${notifyContent.type}`}>
        <a class="notify__close">x</a>
        <div className="notify__wrapper">
            <div className="notify__content">
                <h4 className="notify__message">{notifyContent.message}</h4>
                    <div className="notify__product">
                        {
                            (notifyContent.content) && (
                            <div className="notify-product">
                                <div className="notify-product__thumbnail">
                                    <img src={notifyContent.content.product.img} alt={notifyContent.content.product.name} />
                                </div>
                                <div className="notify-product__content">
                                    <span className="notify-product__title">{notifyContent.content.product.name}</span>
                                    <span className="notify-product__option">
                                        {
                                            notifyContent.content.product.color_picked + "/" + notifyContent.content.product.size_picked
                                        }
                                    </span>
                                    <span className="notify-product__prices">
                                        <del>{notifyContent.content.product.old_price + "đ"}</del>
                                        <ins>{notifyContent.content.product.new_price + "đ"}</ins>
                                    </span>
                                </div>
                            </div>
                            )
                        }
                    </div>
                {
                     (notifyContent.content) && (
                         <a href="/cart" className="btn btn--outline btn--small">Xem giỏ hàng</a>
                     )
                }
            </div>
        </div>
    </div>
    )
}

export default Notify