import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye } from "react-icons/fa";

  const ItemPopup = ({ sale }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Eye button */}
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <FaEye />
      </button>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Popup box */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg p-4"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                لیست کالاها
              </h3>
              <ul className="space-y-2">
                {Object.entries(sale.list).map(([k, v]) => (
                  <li
                    key={k}
                    className="flex justify-between border-b pb-1 text-sm"
                  >
                    <span>{k}</span>
                    <span className="text-gray-600">{v}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700"
              >
                بستن
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemPopup;