import React, { useState } from "react";
import { authApi } from "../../apis/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = authApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const credentials = { email, password };
      console.log(credentials)

      const res = await login(credentials);
      const userID = res?.userID;
      if (userID) {
        // Clear all previous session data to prevent multi-user conflicts
        localStorage.clear();
        // Set new user session
        localStorage.setItem("userID", String(userID));
        localStorage.setItem("loggedInAt", String(Date.now()));
      }

      setMessage([res.message, "success"]);
      setTimeout(() => {
        console.log("..." + userID)
        navigate("/dashboard", { state: { userID } });
      }, 1000);

    } catch (err) {
      if (err.response?.status == 401) {
        setMessage(["Invalid email or password", "error"]);
      } else {
        setMessage([err.message, "error"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Login box */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Please sign in to continue
        </p>

        {/* Error */}
        {message && message[1] == "error" && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4 text-sm">
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
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full 
                p-3 
                border border-gray-300 
                rounded-lg 
                focus:outline-none 
                focus:ring-2 
                focus:ring-indigo-400 
                text-gray-800
              "
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full 
                p-3 
                border border-gray-300 
                rounded-lg 
                focus:outline-none 
                focus:ring-2 
                focus:ring-indigo-400 
                text-gray-800
              "
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full 
              py-3 
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
