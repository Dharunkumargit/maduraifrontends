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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    /* 🔵 Mobile background */
    <div className="relative min-h-screen bg-darkest-blue md:bg-transparent font-roboto-flex">
      <div className="relative flex min-h-screen">
        {/* ================= LEFT IMAGE (MD+) ================= */}
        <div
          className="hidden md:flex w-1/2 relative bg-cover bg-center items-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-center">
            {/* Desktop Logo */}
            <div className="absolute top-10 left-10 md:left-20">
              <img
                src={logo}
                alt="Madurai Logo"
                className="w-20 md:w-24 object-contain"
              />
            </div>

            {/* Vanakkam Madurai */}
            <div className="flex justify-end h-108">
              <div className="bg-white/35 rounded-l-[3rem] pt-18 pl-15 w-135 max-w-2xl shadow-2xl">
                <h1 className="text-7xl font-bold text-black leading-tight">
                  Vanakkam
                  <br />
                  <span className="block mt-7">Madurai</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT BLUE (MD+) ================= */}
        <div className="hidden md:block w-1/2 bg-darkest-blue" />

        {/* ================= LOGIN FORM ================= */}
        <div className="absolute inset-0 flex flex-col justify-center items-center md:ml-100">
          
          {/* ✅ MOBILE LOGO */}
          <div className="md:hidden mb-6">
            <img
              src={logo}
              alt="Madurai Logo"
              className="w-24 mx-auto"
            />
          </div>

          {/* Login Card */}
          <div className="w-full max-w-lg bg-white p-7 rounded-xl shadow-xl mx-4">
            <div className="flex justify-center">
              <p className="text-4xl font-semibold my-4">Login</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)}>
              {/* Email */}
              <label className="grid mb-4 font-semibold">
                Email ID
                <input
                  type="text"
                  {...register("email")}
                  className={`border-2 rounded-md py-2 px-2 outline-none ${
                    errors.email
                      ? "border-red-500"
                      : "border-input-bordergrey"
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </label>

              {/* Password */}
              <label className="grid relative font-semibold">
                Password
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`border-2 rounded-md py-2 px-2 pr-10 outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-input-bordergrey"
                  }`}
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer"
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

              {/* Remember Me */}
              <div className="flex items-center mt-6">
                <input type="checkbox" className="mr-2" />
                <label>Remember me</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 my-5 text-lg font-semibold rounded-md text-white bg-darkest-blue"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            {/* Reset Password */}
            <p className="text-right text-sm">
              Need Help?{" "}
              <span
                onClick={() => navigate("/resetpassword")}
                className="cursor-pointer hover:underline"
              >
                Reset Password
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
