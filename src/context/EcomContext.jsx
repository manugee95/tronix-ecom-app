import { createContext, useState, useEffect, useContext } from "react";
import useAlert from "../hooks/useAlert";
import AuthContext from "./AuthContext";

const EcomContext = createContext();

export const EcomProvider = ({ children }) => {
  const [state, dispatch] = useContext(AuthContext)
  const [product, setProduct] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [slide, setSlide] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0)
  const [order, setOrder] = useState(null)
  const { showAndHide, alertInfo } = useAlert();

  useEffect(() => {
    fetchProduct();
    fetchFeatured();
    fetchTopSelling();
    fetchCart();
  }, []);

  useEffect(()=>{
    const count = cartItems.products?.reduce(
      (count, item) => count + item.quantity,
      0
    );

    setCartCount(count)
  }, [cartItems])

  const isAuthenticated = state.accessToken !== null;

  console.log(cartCount);

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
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setCartItems(data)
      showAndHide("success", "Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAndHide("error", "Failed to add item to cart");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  console.log(cartItems);

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

  const updateQuantity = async (productId, quantity) => {
    if (!quantity > 0) {
      showAndHide("error", "quantity cannot be less than 1");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/update-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        const existingItemIndex = cartItems.products?.findIndex(
          (item) => item.product._id === productId
        );
        const updatedCartItem = [...cartItems.products];
        const itemToUpdate = updatedCartItem[existingItemIndex];
        itemToUpdate.quantity = parseInt(quantity);
        itemToUpdate.amount =
          parseInt(itemToUpdate.product.price) * itemToUpdate.quantity;
        setCartItems({ ...cartItems, products: updatedCartItem });
      } else {
        console.error(data.msg || "Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    console.log(productId);
    try {
      const res = await fetch("http://localhost:3000/remove-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        console.error(data.msg || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
    }
    // const updatedCartItem = cartItems.products?.filter(
    //   (item) => item.product._id !== id
    // );
    // setCartItems(updatedCartItem);
    // showAndHide("success", "Item removed from cart");
  };

  const totalAmount = () => {
    return cartItems.products?.reduce((total, item) => total + item.amount, 0);
  };

  // const handleCheckout = async (e) => {
  //   e.preventDefault()
  //   const amount = totalAmount();
  //   const currency = "NGN";

  //   try {
  //     const res = await fetch("http://localhost:3000/api/payment/initiate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "auth-token": `${localStorage.getItem("auth-token")}`,
  //       },
  //       body: JSON.stringify({ amount, currency }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       window.location.href = data.link;
  //     } else {
  //       console.error(data.msg || "Failed to initiate payment");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const createOrder = async (transaction_id, orderId) => {
    try {
      const res = await fetch('http://localhost:3000/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": `${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({ transaction_id, orderId }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setCartItems([]);
      } else {
        console.error(data.msg);
      }
    } catch (err) {
      console.error(err);
    }
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
        setCartItems,
        fetchCart,
        updateQuantity,
        removeItem,
        totalAmount,
        showAndHide,
        alertInfo,
        cartCount,
        createOrder,
        isAuthenticated,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomContext;
