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
    <motion.div
      className="w-full max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white p-8 rounded-3xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-gray-100"
        variants={formVariants}
        style={{
          backgroundImage: "radial-gradient(circle at top right, rgba(240, 249, 255, 0.8), transparent)",
        }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 text-gray-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          variants={itemVariants}
        >
          AI Text Summarizer
        </motion.h2>

        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <motion.textarea
                className="w-full p-5 text-base border border-gray-300 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 bg-white bg-opacity-80 min-h-40 resize-none"
                rows={6}
                placeholder="Enter your long text or paste a URL here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                initial="blur"
                whileFocus="focus"
                animate={text ? "focus" : "blur"}
                variants={textareaVariants}
              />
              
              {text && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={clearText}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
              
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    className="mt-2 text-xs text-blue-600 italic pl-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    Tip: Longer texts will provide more detailed summaries
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                className="mt-2 text-xs text-gray-500 flex justify-between px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: characterCount > 0 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span>{characterCount} characters</span>
                <motion.span
                  animate={{ 
                    color: characterCount > 1000 ? "rgb(34, 197, 94)" : "rgb(107, 114, 128)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {characterCount > 1000 ? "Good length for summarization" : ""}
                </motion.span>
              </motion.div>
            </div>

            <motion.div className="flex justify-center">
              <motion.button
                type="submit"
                className={`relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium transition-all overflow-hidden ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={loading}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                animate={loading ? "loading" : "idle"}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
                  initial={{ x: "-100%" }}
                  animate={isSubmitting ? { x: "0%" } : { x: "-100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                <motion.div className="relative flex items-center justify-center gap-2">
                  {loading && (
                    <motion.svg
                      className="animate-spin h-5 w-5 text-white"
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
                  <span>{loading ? "Summarizing..." : "Summarize Text"}</span>
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
    </motion.div>
  );
}