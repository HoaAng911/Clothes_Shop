import { createContext } from 'react';
import useCartStore from '../store/useCartStore';
import all_product from '../Components/Assets/all_product';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const {
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        clearCart
    } = useCartStore();

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
