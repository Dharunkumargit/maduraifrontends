

import { useNavigate } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoEye, IoEyeOff } from "react-icons/io5";
import logo from "../../assets/images/MaduraiLogo.png";
import bgImage from "../../assets/images/WelcomeLogo.png";
import { useState } from "react";
import { API } from "../../../const";
import { toast } from "react-toastify";

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Initialize form with React Hook Form and Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Handle Login Submission
  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/user/login`, data);
  
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Section with Image */}
      <div
        className="w-1/2 relative bg-cover bg-center inset-0 flex justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative pt-11">
          <div className="pl-33 my-4">
            <img src={logo} alt="Madurai Logo" className="w-22" />
          </div>
          <div className="text-black bg-white/37 transparent rounded-l-4xl px-10 py-10 w-120 h-107 ml-37">
            <h1 className="text-7xl font-semibold font-roboto-flex mt-10 px-5">
              Vanakkamnmmmm <br />
              <span className="block mt-6">Madurai</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side Blue Background */}
      <div className="w-1/2 bg-[#1E3A8A]" />

      {/* Login Form */}
      <div className="absolute inset-0 flex justify-center items-center ml-100">
        <div className="w-full max-w-lg bg-white p-6 rounded-xl font-roboto-flex">
          <div className="flex justify-center items-center">
            <p className="text-4xl font-semibold my-4">Login</p>
          </div>

          <form className="mx-4 mt-2" onSubmit={handleSubmit(handleLogin)}>
            {/* Email Field */}
            <label className="grid mb-4 font-semibold">
              Email ID
              <input
                type="text"
                {...register("email")}
                className={`border-2 outline-none rounded-md py-2 px-2 ${
                  errors.email ? "border-red-500" : "border-input-bordergrey"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </label>

            {/* Password Field */}
            <label className="grid relative font-semibold">
              Password
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`border-2 outline-none rounded-md py-2 px-2 pr-10 ${
                  errors.password ? "border-red-500" : "border-input-bordergrey"
                }`}
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </span>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </label>

            {/* Forgot Password */}
            {/* <p
              onClick={() => navigate("/forgotpassword")}
              className="text-right text-sm cursor-pointer hover:underline mt-4"
            >
              Forgot Password?
            </p> */}

            {/* Remember Me */}.
            <div className="flex items-center ">
              <input type="checkbox" className="mr-2" />
              <label>Remember me</label>
            </div>

            {/* Submit Button */}
            <button
                  // onClick={()=>navigate("/dashboard")}
              type="submit"
              className="text-white bg-darkest-blue text-center w-full py-2 my-5 rounded-md text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Reset Password */}
          <p className="text-right cursor-pointer text-sm mr-4">
            Need Help?{" "}
            <span
              onClick={() => navigate("/resetpassword")}
              className="hover:underline text-sm cursor-pointer"
            >
              Reset Password
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;