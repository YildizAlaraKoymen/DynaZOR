import React, { useState } from "react";
import { authApi } from "../../apis/authApi";
import { userApi } from "../../apis/userApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = authApi();
  const { createSchedule } = userApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const credentials = { email, name, surname, username, password };

    try {
      const res = await register(credentials);
      const userID = res?.userID;
      if (!userID) throw new Error("Missing userID from register");

      setMessage([res.message, "success"]);

      const today = new Date().toISOString().split("T")[0];
      await createSchedule({ userID, scheduleDate: today });

      localStorage.setItem("userID", String(userID));

      setTimeout(() => {
        navigate("/dashboard", { state: { userID } });
      }, 1000);
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage(["User already exists with this email or username", "error"]);
      } else {
        setMessage([err.message || "Failed to register user", "error"]);
      }
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
        {message && message[1] == "error" && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center text-sm">
            {message[0]}
          </div>
        )}
        {/* Success */}
        {message && message[1] == "success" && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-center mb-4 text-sm">
            {message[0]}
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
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
