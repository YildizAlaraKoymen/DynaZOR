import React, { useState } from "react";
import { userApi } from "../../apis/userApi";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addUser } = userApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const payload = { email, name, surname, username, password };
    console.log("Register payload:", payload);

    try {
      const data = await addUser(payload);

      console.log("User created:", data);

      window.location.href = "/home";
    } catch (err) {
      setError(err.message || "Failed to register user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Create an Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Fill in your information to get started
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="John"
            />
          </div>

          {/* Surname */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Surname</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="Doe"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="johndoe123"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3 
              bg-indigo-600 
              hover:bg-indigo-700 
              text-white 
              font-semibold 
              rounded-lg 
              text-lg 
              transition 
              active:scale-[0.98]
              disabled:opacity-50
            "
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
