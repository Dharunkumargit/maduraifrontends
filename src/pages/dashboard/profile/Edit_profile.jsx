import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../../../const";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  emailid: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
});

const Edit_profile = ({ user, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        emailid: user.email || "",
        phonenumber: user.phonenumber || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`${API}/employee/updateemployee/${user._id}`, data);
      toast.success("Profile Updated Successfully!");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm">Full Name</p>
        <input
          {...register("name")}
          className="w-96 py-3 px-2 rounded-md bg-light-blue"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm">Email ID</p>
        <input
          {...register("emailid")}
          className="w-96 py-3 px-2 rounded-md bg-light-blue"
        />
        {errors.emailid && (
          <p className="text-red-500 text-sm">{errors.emailid.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm">Phone number</p>
        <input
          {...register("phonenumber")}
          className="w-96 py-3 px-2 rounded-md bg-light-blue"
        />
        {errors.phonenumber && (
          <p className="text-red-500 text-sm">
            {errors.phonenumber.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        
        <button
          type="submit"
          className="bg-darkest-blue text-white px-6 py-2 rounded"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
};

export default Edit_profile;
