// src/features/authentication/components/LoginPage.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input"; // Assuming this is your custom input
import { useDispatch, useSelector } from "react-redux";
import { signIn, clearUserError } from "../../../state/userSlice/userSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get loading, error, and user status from the Redux store
  const { loading, error, currentUser } = useSelector((state) => state.user);

  // Clear previous errors when the component mounts
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  // Navigate away if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSignin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(signIn({ email, password }));
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center parallax-bg"
      style={{
        backgroundImage: 'url("/1.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        style={{ zIndex: 1 }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/20"
      >
        <div className="p-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text"
          >
           خوش امدید
          </motion.h2>

          <form onSubmit={handleSignin}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center mb-6 justify-start"
            >
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:underline"
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </motion.div>

            {/* Error message is now handled automatically by toast in the slice */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:via-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "ورود"
              )}
            </motion.button>
          </form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="px-8 py-4 bg-gray-800/70 flex justify-center"
        >
          <p className="text-sm space-x-2 text-gray-300">
            حساب نداری؟
            <Link to="/sign-up" className="text-cyan-400 hover:underline">
              ثبت نام
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
