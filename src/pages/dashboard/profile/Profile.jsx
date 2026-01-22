import React, { useEffect, useState } from "react";
import Edit_profile from "./Edit_profile";
import Update_Password from "./Update_Password";
import logo from "../../../assets/images/Profile2.png";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../../const";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("editProfile");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.user_id;

  
  const handleProfileSave = async (data) => {
  try {
    const res = await axios.put(
      `${API}/users/update/${userId}`,
      data
    );

    toast.success("Profile updated successfully");

    // update localStorage
    const updatedUser = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // update state
    setUser(updatedUser);
  } catch (error) {
    toast.error("Failed to update profile");
    console.error(error);
  }
};

  return (
    <div className="p-6 bg-white mb-14   mr-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="text-sm text-light-grey">
        Manage your personal details and account settings.
      </p>

      <div className="flex flex-col md:flex-row gap-8 mt-7">
        {/* LEFT CARD */}
        <div className="shadow-md rounded-lg p-6 flex flex-col items-center h-120">
          <img
            src={logo}
            alt="avatar"
            className="w-40 h-40 rounded-full mb-4"
          />

          {user && (
            <>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-light-grey">{user.role || "User"}</p>
              <p className="text-sm text-light-grey">{user.email}</p>
              
              
            </>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setActiveSection("editProfile")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "editProfile"
                  ? "bg-darkest-blue text-white"
                  : "bg-gray-100"
              }`}
            >
              Edit Profile
            </button>

            <button
              onClick={() => setActiveSection("updatePassword")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "updatePassword"
                  ? "bg-darkest-blue text-white"
                  : "bg-gray-100"
              }`}
            >
              Update Password
            </button>
          </div>
        </div>

       
        <div>
          {activeSection === "editProfile" ? (
            <Edit_profile user={user} onSave={handleProfileSave} />
          ) : (
            <Update_Password userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
