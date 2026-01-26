import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../const";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoEye, IoEyeOff } from "react-icons/io5";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const Update_Password = ({ user }) => {
  const [loading, setLoading] = useState(false);

  
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API}/user/login`, {
        email: user.email,
        password: data.currentPassword,
      });

      await axios.put(`${API}/user/changepassword/${user.id}`, {
        newPassword: data.newPassword,
      });

      toast.success("Password updated successfully!");
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const Eye = ({ visible, onClick }) => (
    <span
      className="absolute pt-5 right-4 top-1/2 -translate-y-1/2 cursor-pointer text-md text-gray-600"
      onClick={onClick}
    >
      {visible ? <IoEyeOff /> : <IoEye />}
    </span>
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Update Password</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="flex flex-col gap-1 relative">
          <p className="font-semibold text-sm">Current Password</p>
          <input
            {...register("currentPassword")}
            type={show.current ? "text" : "password"}
            className="w-96 py-3 px-2 pr-10 rounded-md bg-light-blue"
          />
          <Eye
            visible={show.current}
            onClick={() =>
              setShow({ ...show, current: !show.current })
            }
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1 relative">
          <p className="font-semibold text-sm">New Password</p>
          <input
            {...register("newPassword")}
            type={show.new ? "text" : "password"}
            className="w-96 py-3 px-2 pr-10 rounded-md bg-light-blue"
          />
          <Eye
            visible={show.new}
            onClick={() => setShow({ ...show, new: !show.new })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1 relative">
          <p className="font-semibold text-sm">Confirm New Password</p>
          <input
            {...register("confirmPassword")}
            type={show.confirm ? "text" : "password"}
            className="w-96 py-3 px-2 pr-10 rounded-md bg-light-blue"
          />
          <Eye
            visible={show.confirm}
            onClick={() =>
              setShow({ ...show, confirm: !show.confirm })
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-darkest-blue text-white px-6 py-2 rounded"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update_Password;
