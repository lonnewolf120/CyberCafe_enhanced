import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log("from cart slice, ADDING COURSE TO CART: ", action.payload)
      const course = action.payload
      const index = state.cart.findIndex((item) => item.COURSE_ID === course.COURSE_ID)

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("Course already in cart")
        return;
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course);
      // Update the total quantity and PRICE
      state.totalItems++;
      // console.log("The total amount: ", state.total)
      if((state.total<0)) state.total=0;
      state.total += course.PRICE;
      // Update to localstorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", (state.total>0)? JSON.stringify(state.total) : JSON.stringify(0));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      // show toast
      toast.success("Course added to cart");
    },

    removeFromCart: (state, action) => {
      const COURSE_ID = action.payload;
      const index = state.cart.findIndex((item) => item.COURSE_ID === COURSE_ID);

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--;
        state.total -= state.cart[index].PRICE;
        if((state.total<0)) state.total=0;
        state.cart.splice(index, 1);
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        // show toast
        toast.success("Course removed from cart");
      }
    },

    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      // Update to localstorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;