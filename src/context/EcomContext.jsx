import { createContext, useState, useEffect } from "react";
import useAlert from "../hooks/useAlert";

const EcomContext = createContext();

export const EcomProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1)
  const [featured, setFeatured] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [slide, setSlide] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const { showAndHide, alertInfo } = useAlert();

  useEffect(() => {
    fetchProduct();
    fetchFeatured();
    fetchTopSelling();
  }, []);

  const fetchProduct = async () => {
    const response = await fetch("http://localhost:3000/api/product");
    const data = await response.json();
    setProduct(data);
  };

  const fetchFeatured = async () => {
    const res = await fetch("http://localhost:3000/api/product/featured");
    const data = await res.json();
    setFeatured(data);
  };
  const fetchTopSelling = async () => {
    const res = await fetch("http://localhost:3000/api/product/topSelling");
    const data = await res.json();
    setTopSelling(data);
  };

  const fetchCarousel = async () => {
    const response = await fetch("http://localhost:3000/carousel");
    const data = await response.json();
    setSlide(data);
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:3000/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setCartItems(data);
      showAndHide("success","Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAndHide("error","Failed to add item to cart");
    }
  };

  console.log(cartItems.products);

  

  // const addToCart = (prod) => {
  //   const existingItemIndex = cartItems.findIndex(
  //     (item) => item.id === prod.id
  //   );
  //   if (existingItemIndex !== -1) {
  //     const updatedCartItem = [...cartItems];
  //     const itemToUpdate = updatedCartItem[existingItemIndex];
  //     itemToUpdate.quantity += prod.quantity;
  //     itemToUpdate.amount = itemToUpdate.price * itemToUpdate.quantity;
  //     showAndHide("error", "Item already exist in cart");
  //   } else {
  //     setCartItems([
  //       ...cartItems,
  //       { ...prod, amount: prod.price * prod.quantity },
  //     ]);
  //     showAndHide("success", "Item added to cart");
  //   }
  // };

  const updateQuantity = (id, newQuantity) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === id);
    const updatedCartItem = [...cartItems];
    const itemToUpdate = updatedCartItem[existingItemIndex];
    itemToUpdate.quantity = newQuantity;
    itemToUpdate.amount = itemToUpdate.price * itemToUpdate.quantity;
    setCartItems(updatedCartItem);
  };

  const removeItem = (id) => {
    const updatedCartItem = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItem);
    showAndHide("success", "Item removed from cart");
  };

  const totalAmount = () => {
    return cartItems.reduce((total, item) => total + item.amount, 0);
  };

  return (
    <EcomContext.Provider
      value={{
        featured,
        topSelling,
        product,
        slide,
        addToCart,
        cartItems,
        updateQuantity,
        removeItem,
        totalAmount,
        showAndHide,
        alertInfo,
        setQuantity,
        quantity
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomContext;
