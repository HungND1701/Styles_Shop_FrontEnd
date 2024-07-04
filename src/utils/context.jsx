import {createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const Context = createContext();

const AppContext = ({ children }) => {
    const [currentMenuAccount, setCurrentMenuAccount] = useState('1');
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isOpenNotify, setIsOpenNotify] = useState(false);
    const [isClickAdd, setIsClickAdd] = useState(false);
    const [notifyContent, setNotifyContent] = useState({
        type: 'message',
        message: '',
        content: null,
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if(isClickAdd){
            setIsOpenNotify(true);
        
            const timer = setTimeout(() => {
              setIsOpenNotify(false);
              setIsClickAdd(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [notifyContent, isClickAdd]);
    const updateProductQuantity = (productId, quantity) => {
        setCart(prevCart =>
          prevCart.map(product =>
            product.id === productId ? { ...product, quantity: quantity } : product
          )
        );
    };
    const updateProductSizeOptions = (productId, options) => {
        setCart(prevCart =>
          prevCart.map(product =>
            product.id === productId ? { ...product, sizeOptions: options } : product
          )
        );
    };
    const updateProductSizePicked = (productId, size) => {
        setCart(prevCart =>
          prevCart.map(product =>
            product.id === productId ? { ...product, size_picked: size, sizeId_picked: product.sizeOptions.filter(sz=>sz.value===size)[0].id} : product
          )
        );
    };
    const updateProductColorPicked = (productId, colorId, color) => {
        setCart(prevCart =>
          prevCart.map(product =>
            product.id === productId ? { ...product, colorId_picked: colorId, color_picked: color } : product
          )
        );
    };

    const addItemToCart = (item) => {
        setCart((prevItems) => {
            const itemIndex = prevItems.findIndex(cartItem => (cartItem.id === item.id && cartItem.color_picked === item.color_picked && cartItem.size_picked === item.size_picked));

            if (itemIndex !== -1) {
                // Sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                const updatedItems = [...prevItems];
                updatedItems[itemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                // Sản phẩm chưa có trong giỏ hàng, thêm mới với quantity = 1
                return [...prevItems, { ...item}];
            }
        });
        setNotifyContent({
            type: 'success',
            message: "Đã thêm vào giỏ hàng",
            content: {
                product: {...item},
            },
        })
    };

    const removeItemFromCart = (index) => {
        setCart((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item of cart){
            totalItem += item.quantity;
        }
        return totalItem;
    }

    function parseNumber(numberString) {
        // Loại bỏ các dấu chấm
        const cleanedString = numberString.replace(/\./g, '');
        // Chuyển chuỗi thành số
        const number = parseInt(cleanedString, 10);
        return number;
    }
    function formatCurrency(number) {
        return number.toLocaleString('vi-VN');
    }

    const contextValue = {user, cart, addItemToCart, removeItemFromCart, clearCart, getTotalCartItems, isOpenNotify, setIsOpenNotify, setNotifyContent, notifyContent, setIsClickAdd, updateProductQuantity, updateProductColorPicked, updateProductSizePicked,updateProductSizeOptions,currentMenuAccount, setCurrentMenuAccount, formatCurrency, parseNumber};
    return (
        <Context.Provider value={contextValue}> 
            { children }
        </Context.Provider>
    )
}

export default AppContext;