import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import { InputField } from "../../../components/InputField";
import axios from "axios";
import { API } from "../../../../const";
import { toast } from "react-toastify";





const schema = yup.object().shape({
  zonename: yup
    .string()

    .required("Zone Name is required"),
  wardname: yup
    .string()
    
    .required("Ward Name is required"),
  
});

const AddWard = ({ onclose,onRefresh }) => {
    const [zone,setZone] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    axios
      .get(`${API}/zone/getzones`)
      .then((response) => {
        setZone(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching zones:", error);
        toast.error("Failed to load Zones");
      });
  }, []);
   
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${API}/ward/createward`,
        data
      );
      toast.success("Ward Added Successfully!");
      reset();
      console.log("Ward Created:", res.data);
      onclose();
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Add Ward");
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
          <h1 className="text-center font-medium text-2xl py-2">Add Ward</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" px-7 py-6">
              <div className=" lg:space-y-4 space-y-3.5">
                <InputField
                  label="Zone Name"
                  name="zonename"
                  type="select"
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                  options={zone.map((zone) => ({
                    value: zone.zonename,
                    label: zone.zonename,
                  }))}
                />
                <InputField
                  label="Ward Name"
                  name="wardname"
                  placeholder="Select here"
                 
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

export default AddWard;
