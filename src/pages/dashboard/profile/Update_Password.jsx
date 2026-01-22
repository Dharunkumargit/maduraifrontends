import React, { useState } from "react";

const Update_Password = () => {
  const [formData, setFormData] = useState({
    new_password: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.password) {
      alert("Passwords do not match");
      return;
    }

    console.log("Update password payload 👉", formData);
    // 👉 call password update API here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm">New Password</p>
        <input
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          className="w-96 py-3 px-2 rounded-md bg-light-blue"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm">Confirm New Password</p>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-96 py-3 px-2 rounded-md bg-light-blue"
        />
      </div>

      {/* ✅ Save button only for Update Password */}
      <button
        type="submit"
        className="bg-darkest-blue text-white px-6 py-2 rounded-md mt-4"
      >
        Update Password
      </button>
    </form>
  );
};

export default Update_Password;
