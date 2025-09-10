import React from "react";
import { motion } from "framer-motion";
import { FaSwimmingPool } from "react-icons/fa";

const WelcomePage = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <FaSwimmingPool className="text-blue-600 text-6xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          خوش آمدید {user?.name || "کاربر"} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          به سیستم مدیریت حوض بند امیر خوش آمدید. از اینجا می‌توانید مشتریان،
          پرداخت‌ها، و خدمات را مدیریت کنید.
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
