import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import EcomContext from "../../context/EcomContext";
import useLocalStorage from "../../hooks/useLocalStorage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, dispatch] = useContext(AuthContext);
  const { showAndHide, isAuthenticated} = useContext(EcomContext);
  const { setItem } = useLocalStorage("auth-token");

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const redirect = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://ecomfront-test.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data === "Invalid Email/Password") {
        showAndHide("error", "Invalid Email/Password");
      } else {
        dispatch({ type: "setToken", payload: data.token });
        setItem(data.token);
        redirect("/");
        showAndHide("success", "login successful!!!");
      }
    } catch (error) {
      showAndHide(error);
    }
  };

  return (
    <div className="w-[30%] mx-auto my-[5%]">
      <h1 className="text-center mb-5 font-bold text-2xl">Login Here</h1>
      <form onSubmit={loginHandler}>
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
          <label className="font-bold" htmlFor="">
            Password
          </label>
          <input
            className="outline outline-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="bg-black text-white p-[10px] rounded-md hover:bg-orange-500">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
