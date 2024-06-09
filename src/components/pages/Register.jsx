import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import EcomContext from "../../context/EcomContext";

function Register() {
  const { showAndHide } = useContext(EcomContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const redirect = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (data === "exist") {
        showAndHide("error", "User Already Exist!!!");
      } else if (data === "validatePassword") {
        showAndHide(
          "error",
          "Password must be atleast 8 characters long and must contain atleast one letter and one number"
        );
      } else if (data === "Password do not match") {
        showAndHide("error", "Password do not match");
      } else {
        redirect("/login");
        showAndHide("success", "Registration Sucessful!!!");
      }
    } catch (error) {
      showAndHide(error.message);
    }
  };

  return (
    <div className="w-[50%] mx-auto my-[5%]">
      <h1 className="text-center mb-5 font-bold text-2xl">Register Here</h1>
      <form onSubmit={registerHandler}>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="firstName">
            First Name
          </label>
          <input
            className="outline outline-1"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="outline outline-1"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="email">
            Email
          </label>
          <input
            className="outline outline-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="outline outline-1"
            type="text"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="">
            Password
          </label>
          <input
            className="outline outline-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mb-3">
          <label className="font-bold" htmlFor="">
            Confirm Password
          </label>
          <input
            className="outline outline-1"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="bg-black text-white p-[10px] rounded-md hover:bg-orange-500">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
