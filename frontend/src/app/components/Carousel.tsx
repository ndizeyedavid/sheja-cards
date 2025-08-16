"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const images = [
  "/screenshots/shot_1.png", // Add your screenshots here
  "/screenshots/shot_2.png",
  "/screenshots/shot_3.png",
  "/screenshots/shot_4.png",
  // More images...
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  return (
    <section
      className="relative w-full overflow-hidden py-16 md:py-24"
      id="screenshots"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header Section with Badge */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            Project Showcase
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground mt-4 text-xl"
          >
            clean and intuitive dashboard, ID cards, and analytics - All in one
            place
          </motion.p>
        </div>
        <div className="relative max-w-full overflow-hidden">
          {/* Carousel Image */}
          <motion.div
            key={currentIndex}
            className="w-full h-[400px] sm:h-[500px] bg-gray-200 rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={images[currentIndex]}
              alt={`Project screenshot ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Prev/Next Buttons */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg"
            onClick={prevImage}
          >
            &#8249;
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg"
            onClick={nextImage}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
