"use client";
import { useState } from "react";
export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    if (result.access_token) {
      localStorage.setItem("access_token", result.access_token);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Sign In
        </h2>

        <form className="space-y-4" onSubmit={loginHandler}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>

          <button className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Dont have an account?
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
