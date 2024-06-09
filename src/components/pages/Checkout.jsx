import { useContext } from "react";
import EcomContext from "../../context/EcomContext";

function Checkout() {
    const {cartItems, totalAmount} = useContext(EcomContext)

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
            {cartItems.map((item) => (
              <tr className="border-b-2">
                <td>{item.name}</td>
                <td>
                  <div className="flex justify-center">
                    <img src={item.img} className="h-[50px]" alt="" />
                  </div>
                </td>
                <td>₦{item.price}</td>
                <td>
                  {item.quantity}
                </td>
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
        <form action="">
            <div className="flex flex-col gap-3 mb-3">
                <label className="font-bold" htmlFor="firstName">First Name</label>
                <input className="outline outline-1" type="text" />
            </div>
            <div className="flex flex-col gap-3 mb-3">
                <label className="font-bold" htmlFor="lastName">Last Name</label>
                <input className="outline outline-1" type="text" />
            </div>
            <div className="flex flex-col gap-3 mb-3">
                <label className="font-bold" htmlFor="phone">Phone Number</label>
                <input className="outline outline-1" type="text" />
            </div>
            <div className="flex flex-col gap-3 mb-3">
                <label className="font-bold" htmlFor="address">Address</label>
                <textarea className="outline outline-1" name="" id="" cols="10" rows="5"></textarea>
            </div>
            <div>
                <button className="bg-black text-white p-[10px] rounded-md hover:bg-orange-500">Pay Now</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
