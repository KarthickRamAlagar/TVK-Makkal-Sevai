import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Confetti from "react-confetti";

const EntryPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [unmuted, setUnmuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const flagImage = "/assets/flag.jpg";

  // Update window size for confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setElapsedTime((prev) => prev + 1),
      1000
    );

    const timeout = setTimeout(() => navigate("/landing"), 29000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const enableAudio = () => {
    if (audioRef.current && !unmuted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setUnmuted(true);
    }
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden ${
        elapsedTime >= 0
          ? "bg-gradient-to-br from-red-500 to-yellow-500"
          : "bg-white"
      }`}
      onClick={enableAudio}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src="/district-theme.mp3" muted />

      {/* Stage 1: White screen (0–1s) */}
      {elapsedTime < 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-yellow-500" />
      )}

      {/* Stage 2: Tamil Quote Typing (1–7s) */}
      {elapsedTime >= 1 && elapsedTime < 7 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-yellow-500 space-y-6">
          <TypeAnimation
            sequence={[
              "பிறப்பொக்கும்",
              1300,
              "எல்லா",
              1300,
              "உயிர்க்கும்",
              1300,
            ]}
            wrapper="h3"
            cursor={false}
            className="text-white text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-wide text-center"
            style={{
              textShadow: `
                2px 2px 0 red,
                -2px -2px 0 red,
                2px -2px 0 red,
                -2px 2px 0 red,
                4px 4px 6px rgba(255,255,0,0.8)
              `,
            }}
          />
        </div>
      )}

      {/* Stage 2 Hold: Show full quote (7–9s) */}
      {elapsedTime >= 7 && elapsedTime < 9 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-yellow-500 space-y-6">
          <h3
            className="text-white text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-wide  text-center"
            style={{
              textShadow: `
                2px 2px 0 red,
                -2px -2px 0 red,
                2px -2px 0 red,
                -2px 2px 0 red,
                4px 4px 6px rgba(255,255,0,0.8)
              `,
            }}
          >
            பிறப்பொக்கும் எல்லா உயிர்க்கும்
          </h3>
        </div>
      )}

      {/* Stage 3: Flag Background with Bounce (9–14s) */}
      {elapsedTime >= 9 && elapsedTime < 14 && (
        <div className="absolute inset-0">
          <img
            src={flagImage}
            alt="Flag Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
            <motion.h3
              initial={{ x: -300, y: -200, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
                delay: 0.2,
              }}
              className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-wide text-center"
              style={{
                textShadow: `
                  2px 2px 0 red,
                  -2px -2px 0 red,
                  2px -2px 0 red,
                  -2px 2px 0 red,
                  4px 4px 6px rgba(0,100,0,0.9)
                `,
              }}
            >
              தமிழக
            </motion.h3>

            <motion.h3
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
                delay: 0.8,
              }}
              className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-wide text-center"
              style={{
                textShadow: `
                  2px 2px 0 red,
                  -2px -2px 0 red,
                  2px -2px 0 red,
                  -2px 2px 0 red,
                  4px 4px 6px rgba(0,100,0,0.9)
                `,
              }}
            >
              வெற்றிக் கழகம்
            </motion.h3>

            <motion.h3
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
                delay: 1.4,
              }}
              className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-wide text-center"
              style={{
                textShadow: `
                  2px 2px 0 red,
                  -2px -2px 0 red,
                  2px -2px 0 red,
                  -2px 2px 0 red,
                  4px 4px 6px rgba(0,100,0,0.9)
                `,
              }}
            >
              வழங்கும்
            </motion.h3>
          </div>
        </div>
      )}

      {/* Stage 4: Main Entry Page Content (14–29s) */}
      {elapsedTime >= 14 && elapsedTime < 29 && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full space-y-6">
          {/* Confetti: only 14–24s */}
          {elapsedTime >= 14 && elapsedTime < 24 && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={350}
              gravity={0.2} // negative → goes upward
              wind={0.05} // slight horizontal movement
              recycle={true} // keeps popping until stage ends
              tweenDuration={600} // slower pieces
              initialVelocityY={12} // start with upward burst
            />
          )}

          <img
            src="/assets/entry_image.png"
            alt="TVK_Brand"
            className="w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[35vw] xl:w-[25vw] max-w-[600px] h-auto mb-6 [filter:drop-shadow(6px_6px_0_red)_drop-shadow(-6px_-6px_0_yellow)]"
          />

          <TypeAnimation
            sequence={["மக்கள் சேவை", 2000]}
            wrapper="h3"
            cursor={false}
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-wide text-center"
            style={{
              textShadow: `
          2px 2px 0 red,
          -2px -2px 0 red,
          2px -2px 0 red,
          -2px 2px 0 red,
          4px 4px 6px rgba(255,255,0,0.8)
        `,
            }}
          />
        </div>
      )}

      {/* Audio Hint */}
      {!unmuted && (
        <div className="absolute bottom-4 w-full flex justify-center z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 shadow-lg">
            {/* Flag image */}
            <img
              src="/assets/flag.jpg"
              alt="Flag"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover"
            />

            {/* Text */}
            <span className="text-white text-sm sm:text-base font-semibold drop-shadow">
              Tap to Enable Audio — let every voice be heard
            </span>
          </div>
        </div>
      )}

      {/* Skip Button */}
      <div
        className={`absolute bottom-6 right-6 z-20 transition-opacity duration-700 ${
          elapsedTime >= 18 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => navigate("/landing")}
          className="bg-white text-green-600 font-bold px-6 sm:px-8 md:px-10 py-2 sm:py-3 rounded-full shadow-md hover:bg-gray-100 transition text-sm sm:text-base md:text-lg"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default EntryPage;
