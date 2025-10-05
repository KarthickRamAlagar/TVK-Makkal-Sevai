import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import flag from "/assets/flag.jpg";

const Alert = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-2 right-4 z-[99999] pointer-events-none"
        >
          <div className="bg-white shadow-md rounded-2xl p-4 flex flex-row items-center gap-4 w-auto max-w-sm sm:max-w-md md:max-w-lg">
            {/* Flag Image */}
            <div className="flex-shrink-0">
              <img
                src={flag}
                alt="flag"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>

            {/* Message */}
            <p className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent break-words whitespace-normal">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
