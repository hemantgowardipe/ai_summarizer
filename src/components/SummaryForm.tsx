"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SummaryForm() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const summaryRef = useRef(null);

  useEffect(() => {
    setCharacterCount(text.length);
    // Show tip only for longer texts
    setShowTip(text.length > 200);
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary returned.");
    } catch (error) {
      console.error("Error summarizing text:", error);
      setSummary("An error occurred while summarizing. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setIsSubmitting(false), 600); // Keep animation state a bit longer
    }
  };

  const clearText = () => {
    setText("");
    setSummary("");
    setCopied(false);
  };

  const handleCopyToClipboard = () => {
    if (navigator.clipboard && summary) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Button animation
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    tap: { scale: 0.97 },
    loading: {
      scale: 1,
      boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1)",
    }
  };

  // Feature card animation
  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Text input animation
  const textareaVariants = {
    focus: { 
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
    },
    blur: { 
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      borderColor: "rgba(209, 213, 219, 1)",
    }
  };

  // Summary result animation
  const summaryVariants = {
    hidden: { opacity: 0, height: 0, y: 20 },
    visible: { 
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.6, delay: 0.2 },
        y: { duration: 0.5, delay: 0.1 },
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <motion.div
        className="w-full max-w-4xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">AI-Powered Text Analysis</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Instant Text Summarizer
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-style: italic"
            variants={itemVariants}
          >
            Transform your lengthy documents, articles, or research papers into concise, 
            actionable summaries in seconds.<b> Perfect for students.</b>
          </motion.p>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600 font-mono ">Get instant summaries powered by advanced AI technology</p>
            </motion.div>

            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Analysis</h3>
              <p className="text-sm text-gray-600 font-mono">Extracts key points and maintains context accuracy</p>
            </motion.div>

            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600 font-mono">Simple paste, click, and copy workflow</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Summary Form Section */}
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <motion.div 
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <label className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Paste your text here
                  </label>
                  
                  {text && (
                    <motion.button
                      type="button"
                      onClick={clearText}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear
                    </motion.button>
                  )}
                </motion.div>
                
                <motion.textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your article, document, or any text you want to summarize here... The more text you provide, the better the summary will be!"
                  className="w-full h-48 p-6 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                  variants={textareaVariants}
                  whileFocus="focus"
                  initial="blur"
                  animate="blur"
                />
                
                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Great! Longer texts produce more detailed and accurate summaries</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div 
                  className="mt-3 flex justify-between items-center px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: characterCount > 0 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{characterCount.toLocaleString()} characters</span>
                  </div>
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ 
                      color: characterCount > 1000 ? "rgb(34, 197, 94)" : "rgb(107, 114, 128)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {characterCount > 1000 && (
                      <motion.svg 
                        className="w-4 h-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                    <span className="text-sm font-medium">
                      {characterCount > 1000 ? "Optimal length for summarization" : ""}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  className={`relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg transition-all overflow-hidden shadow-lg ${
                    loading || !text.trim() ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  }`}
                  disabled={loading || !text.trim()}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={!loading && text.trim() ? "hover" : "idle"}
                  whileTap={!loading && text.trim() ? "tap" : "idle"}
                  animate={loading ? "loading" : "idle"}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-700"
                    initial={{ x: "-100%" }}
                    animate={isSubmitting ? { x: "0%" } : { x: "-100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  
                  <motion.div className="relative flex items-center justify-center gap-3">
                    {loading && (
                      <motion.svg
                        className="animate-spin h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </motion.svg>
                    )}
                    <span>{loading ? "Analyzing & Summarizing..." : "✨ Generate Summary"}</span>
                  </motion.div>
                </motion.button>
              </motion.div>
            </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {summary && (
            <motion.div
              className="mt-8 relative"
              key="summary-container"
              variants={summaryVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="absolute -top-4 -left-4 h-8 w-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm"
                ref={summaryRef}
              >
                <motion.div 
                  className="flex justify-between items-start mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
                      Summary
                    </span>
                  </h3>
                  
                  <motion.button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Copy to clipboard"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Copied!</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          <span>Copy</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
                
                <motion.div
                  className="space-y-2 text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {summary.split('\n').map((paragraph, i) => (
                    <motion.p 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                      className="leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}