import { useContext, useState } from "react";
import EcomContext from "../../context/EcomContext";
import { Navigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

function Checkout() {
  const { cartItems, totalAmount, isAuthenticated } =
    useContext(EcomContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const {setItem} = useLocalStorage("formData")

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault()

    const firstName = e.target.elements.firstName.value 
    const lastName = e.target.elements.lastName.value 
    const phone = e.target.elements.phone.value 
    const address = e.target.elements.address.value 

    const amount = totalAmount();
    const currency = "NGN";

    try {
      const res = await fetch("http://localhost:3000/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ amount, currency, firstName, lastName, phone, address }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = data.link;
      } else {
        console.error(data.msg || "Failed to initiate payment");
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex gap-5 m-[5%]">
      <div className="w-[50%]">
        <h1 className="font-bold text-center mb-5">Order Summary</h1>
        <table className="w-[90%] mx-auto h-[30vh]">
          <thead>
            <th>Item</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
          </thead>
          <tbody className="text-center">
            {cartItems.products?.map((item) => (
              <tr className="border-b-2" key={item.product._id}>
                <td>{item.product.name}</td>
                <td>
                  <div className="flex justify-center">
                    <img
                      src={"http://localhost:3000/" + item.product.img}
                      className="h-[50px]"
                      alt=""
                    />
                  </div>
                </td>
                <td>₦{item.product.price}</td>
                <td>{item.quantity}</td>
                <td>₦{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-[90%] mx-auto">
          <h1 className="text-2xl font-bold">Total = ₦{totalAmount()}</h1>
        </div>
      </div>
      <div className="w-[50%]">
        <h1 className="mb-5 font-bold text-center">Delivery Information</h1>
        <form onSubmit={(e) => handleCheckout(e)} id="orderID">
          <div className="flex flex-col gap-3 mb-3">
            <label className="font-bold" htmlFor="firstName">
              First Name
            </label>
            <input
              className="outline outline-1"
              type="text"
              name="firstName"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <label className="font-bold" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="outline outline-1"
              type="text"
              name="lastName"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <label className="font-bold" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="outline outline-1"
              type="text"
              name="phone"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <label className="font-bold" htmlFor="address">
              Address
            </label>
            <textarea
              className="outline outline-1"
              name="address"
              id=""
              cols="10"
              rows="5"
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <button className="bg-black text-white p-[10px] rounded-md hover:bg-orange-500">
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
