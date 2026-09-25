import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaCamera, FaRobot, FaClipboardList, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Disclosure, Transition } from "@headlessui/react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const HomePage = ({ faqs }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult("");

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/detect/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult("Error detecting disease. Try again.");
    }
    setIsAnalyzing(false);
  };

  const handleLearnMore = () => {
    if (!result) return;
    navigate(`/diseaseinfo/${encodeURIComponent(result)}`);
  };

  return (
    <div className="overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Premium Hero Section with Glassmorphism */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/20 blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content Area */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold text-sm mb-6 border border-green-200 dark:border-green-800 backdrop-blur-md">
                ✨ Powered by AI 
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                {t('hero.title').split(' ').map((word, i) => 
                   i === 1 || i === 2 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400"> {word}</span> : ` ${word}`
                )}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-light">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Scroll Down Hint instead of old generic button */}
                <a href="#analyzer" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all font-semibold flex items-center gap-2 transform hover:-translate-y-1">
                   Get Started <FaUpload />
                </a>
              </div>
            </motion.div>

            {/* Right Upload / Analyzer Area (Glassmorphism) */}
            <motion.div id="analyzer"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full lg:w-1/2 max-w-lg"
            >
              <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 p-8 rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/50">
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Analyze Crop Health</h3>

                <AnimatePresence mode="wait">
                  {!imagePreview ? (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragOver ? "border-green-500 bg-green-50/50 dark:bg-green-900/20" : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <FaUpload className="text-3xl text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2 text-lg">Drag & Drop Image</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">or click to browse from device</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                         <img src={imagePreview} alt="Crop preview" className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-medium cursor-pointer hover:bg-white/30 transition border border-white/30">
                              Choose Different Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                         </div>
                      </div>

                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md flex items-center justify-center gap-3 relative overflow-hidden ${
                          isAnalyzing ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 hover:shadow-green-500/40 transform hover:-translate-y-0.5"
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Analyzing with AI...
                          </>
                        ) : (
                          <>
                             <FaRobot className="text-xl" /> Detect Disease
                          </>
                        )}
                      </button>

                      {/* Result Presentation */}
                      <AnimatePresence>
                        {result && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, height: 0 }} 
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            className={`p-5 rounded-xl border ${result.toLowerCase().includes("healthy") ? "bg-green-50/80 border-green-200 dark:bg-green-900/30 dark:border-green-800/50" : "bg-red-50/80 border-red-200 dark:bg-red-900/30 dark:border-red-800/50"}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {result.toLowerCase().includes("healthy") ? 
                                   <FaCheckCircle className="text-green-500 text-2xl" /> : 
                                   <FaExclamationTriangle className="text-red-500 text-2xl" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                  {result}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                  {result.toLowerCase().includes("healthy") 
                                    ? "Great news! Your plant looks perfectly healthy. Keep up the good work." 
                                    : "We detected signs of disease. Our AI can provide treatment solutions."}
                                </p>
                                {!result.toLowerCase().includes("healthy") && (
                                  <button onClick={handleLearnMore} className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                                    <FaInfoCircle /> View Treatment Guide &rarr;
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-24 relative z-10 bg-white dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('howItWorks.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: FaCamera, title: t('howItWorks.steps.capture.title'), description: t('howItWorks.steps.capture.description'), color: "from-blue-500 to-cyan-400" },
              { icon: FaRobot, title: t('howItWorks.steps.analyze.title'), description: t('howItWorks.steps.analyze.description'), color: "from-green-500 to-emerald-400" },
              { icon: FaClipboardList, title: t('howItWorks.steps.diagnose.title'), description: t('howItWorks.steps.diagnose.description'), color: "from-purple-500 to-pink-400" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 dark:bg-gray-700/40 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-all"
              >
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 bg-gradient-to-br ${step.color} p-0.5 shadow-lg`}>
                   <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                      <step.icon className="text-3xl text-gray-800 dark:text-white" />
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sleek FAQs Section */}
      <section className="py-24 bg-green-50/50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faqs.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Disclosure key={index} as="div">
                {({ open }) => (
                  <motion.div 
                    initial={false}
                    animate={{ backgroundColor: open ? "rgba(34, 197, 94, 0.05)" : "transparent" }}
                    className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-sm"
                  >
                    <Disclosure.Button className="flex justify-between items-center w-full px-8 py-5 text-left focus:outline-none">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                      <span className={`transform transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${open ? "rotate-180 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "text-gray-500"}`}>
                        ▼
                      </span>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="transform opacity-0 -translate-y-4"
                      enterTo="transform opacity-100 translate-y-0"
                      leave="transition duration-150 ease-in"
                      leaveFrom="transform opacity-100 translate-y-0"
                      leaveTo="transform opacity-0 -translate-y-4"
                    >
                      <Disclosure.Panel className="px-8 pb-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-4"></div>
                        {faq.answer}
                      </Disclosure.Panel>
                    </Transition>
                  </motion.div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
