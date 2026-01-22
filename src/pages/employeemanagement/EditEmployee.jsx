import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import { InputField } from "../../components/InputField";
import axios from "axios";
import { API } from "../../../const";
import { toast } from "react-toastify";
import { use, useEffect } from "react";




const schema = yup.object().shape({
  name: yup
    .string()

    .required("Name is required"),
  
    phonenumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  location: yup
    .string()
    
    .required("Location is required"),
  emailid: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  designation: yup
    .string()

    
    .required("Designation is required"),
});

const EditEmployee = ({ onclose, item }) => {
    
    
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    
  });
  
  
 useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        phonenumber: item.phonenumber,
        location: item.location,
        emailid: item.emailid,
        designation: item.designation
      });
    }
  }, [item, reset]);

 const onSubmit = async (data) => {
  try {
    const res = await axios.put(
      `${API}/employee/updateemployee/${item._id}`,
      data
    );
    toast.success("Employee Updated Successfully!");
    console.log("Employee Updated:", res.data);
    onclose();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to Update Employee");
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
          <h1 className="text-center font-medium text-2xl py-2">Edit Employee</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" px-7 py-6">
              <div className=" lg:space-y-4 space-y-3.5">
                <InputField
                  label="Name"
                  name="name"
                  
                  placeholder="Type Here"
                  register={register}
                  errors={errors}
                 
                />
                
                
                <InputField
                  label="Phone Number"
                  name="phonenumber"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                />
                <InputField
                  label="Location"
                  name="location"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                />
                <InputField
                  label="Email ID"
                  name="emailid"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                />

                <InputField
                  label="Designation"
                  name="designation"
                  register={register}
                  errors={errors}
                  placeholder="Type Here"
                  
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

export default EditEmployee;
