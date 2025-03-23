"use client";

import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const user = {
      displayName: formData.displayName,
      email: formData.email,
      password: formData.password,
    };
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
      <div className="group relative z-0 mb-5 w-full">
        <input
          type="email"
          name="email"
          id="floating_email"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label
          htmlFor="floating_email"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          Email address
        </label>
      </div>
      <div className="group relative z-0 mb-5 w-full">
        <input
          type="password"
          name="password"
          id="floating_password"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          value={formData.password}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label
          htmlFor="floating_password"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
        >
          Password
        </label>
      </div>
      {/* <div className="group relative z-0 mb-5 w-full">
        <input
          type="password"
          name="repeat_password"
          id="floating_repeat_password"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          value={formData.password}
          onChange={handleChange}
          placeholder=" "
          required
        />
        <label
          htmlFor="floating_repeat_password"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
        >
          Confirm password
        </label>
      </div> */}
      <div className="grid">
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="displayName"
            id="floating_first_name"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            value={formData.displayName}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_first_name"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:translate-x-1/4"
          >
            Display Name
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Submit
      </button>
    </form>
  );
}
