import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import { InputField } from "../../../components/InputField";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../../const";





const schema = yup.object().shape({
  zonename: yup
    .string()

    .required("Zone Name is required"),
  
});

const AddZone = ({ onclose,onRefresh }) => {
  
  const {
    register,
    handleSubmit,
    reset,
    
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API}/zone/createzone`, data);

      toast.success("Zone Added Successfully! ");
      reset();
      onclose();
      onRefresh(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Add Zone ");
    }
  };
  

  return (
    <div className="font-roboto-flex fixed inset-0 grid justify-center items-center backdrop-blur-xs backdrop-grayscale-50  drop-shadow-lg z-20">
      <div className=" shadow-lg py-2  bg-white  rounded-md  ">
        <div className="grid">
          <button
            onClick={onclose}
            className=" place-self-end   cursor-pointer bg-white rounded-full lg:-mx-4 md:-mx-4 -mx-2 lg:-my- md:-my-5  -my-3 lg:shadow-md md:shadow-md shadow-none lg:py-2.5 md:py-2.5 py-1 lg:px-2.5 md:px-2.5 px-1 "
          >
            <IoClose className="size-[24px]" />
          </button>
          <h1 className="text-center font-medium text-2xl py-2">Add Zone</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" px-7 py-6">
              <div className=" lg:space-y-4 space-y-3.5">
                <InputField
                  label="Zone Name"
                  name="zonename"
                  placeholder="Type Here"
                  register={register}
                  
                  errors={errors}
                />
               
                  
                
              </div>
            </div>
            <div className="mx-7 text-xs flex lg:justify-end md:justify-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={onclose}
                className="cursor-pointer  border  border-light-grey  text-light-grey px-6 py-2   rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 bg-darkest-blue text-white py-2   rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddZone;
