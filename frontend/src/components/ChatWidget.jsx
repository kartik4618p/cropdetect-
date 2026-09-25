import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-500 text-white rounded-full p-4 shadow-lg shadow-green-500/50 flex items-center justify-center transition-colors"
        >
          {isOpen ? <FaTimes className="text-2xl" /> : <FaRobot className="text-2xl" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-[60] border border-gray-200 dark:border-gray-700 flex flex-col backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white">
                <FaRobot className="text-2xl" />
                <span className="font-semibold text-lg">AI Assitant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="flex-1 w-full bg-gray-50 dark:bg-gray-800 relative">
               {/* 
                  The bot is running on port 5000 from Flask. 
                  We render it inside an iframe.
               */}
               <iframe 
                 src="http://localhost:5000" 
                 className="w-full h-full border-none absolute inset-0"
                 title="AI Agriculture Assistant"
                 allow="microphone; camera"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;