import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    isVisible: false,
    product: null,
    isSearch: false,
  },
  reducers: {
    clear: (state) => {
      state.cartItems = [];
    },
    setProduct: (state, action) => {
      const oldCartItems = state.cartItems;
      const newProduct = action.payload;
      const oldProduct = oldCartItems.find(
        (item) => item.productOptionId === newProduct.productOptionId
      );

      if (
        oldCartItems.length > 0 &&
        !oldCartItems.find((item) => item.shipper_id === newProduct.shipper_id)
      ) {
        state.isVisible = true;
        state.product = newProduct;
        return;
      }

      if (oldProduct) {
        state.cartItems = oldCartItems.map((item) => {
          if (item.productOptionId === newProduct.productOptionId) {
            item.quantity = item.quantity + newProduct.quantity;
            return item;
          }
          return item;
        });
      } else {
        state.cartItems = [...oldCartItems, newProduct];
      }
    },
    increment: (state, action) => {
      state.cartItems = state.cartItems.map((item) => {
        if (item.productOptionId === action.payload) {
          item.quantity = item.quantity + 1;
          return item;
        }
        return item;
      });
    },
    decrement: (state, action) => {
      const product = state.cartItems.find(
        (val) => val.productOptionId === action.payload
      );
      if (product.quantity > 1) {
        state.cartItems = state.cartItems.map((item) => {
          if (item.productOptionId === action.payload) {
            item.quantity = item.quantity - 1;
            return item;
          }
          return item;
        });
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => item.productOptionId !== action.payload
        );
      }
    },
    closeModal: (state) => {
      state.isVisible = false;
      state.product = null;
    },
    acceptClearCart: (state) => {
      state.isVisible = false;
      state.cartItems = [];
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
  },
});

export const {
  setProduct,
  decrement,
  increment,
  clear,
  closeModal,
  acceptClearCart,
  setIsSearch,
} = cartSlice.actions;

export const totalPriceProducts = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const totalPrice = cartItems.reduce((total, item) => {
    // let optionPrice = 0
    // let childOptionsPrice = 0

    // if (item.option && item.option.price) {
    //   optionPrice = +item.option.price
    //   childOptionsPrice = item.option.child_options.reduce((a, b) => {
    //     return a + +(b ? b.price : 0)
    //   }, 0)
    // }
    // console.log('item', item)
    return total + +item.totalPrice * item.quantity;
  }, 0);

  return totalPrice;
};
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectCount = (state) => state.counter?.value

export default cartSlice.reducer;
